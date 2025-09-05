import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Provider, ProviderSpecialization, Slot, Review, TransformedSlot } from '@/types/supabase';

// Provider Hook
export const useProvider = (providerId: string) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    const fetchProvider = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('providers')
          .select(`
            *,
            provider_specializations (
              specialization_id,
              specializations (name)
            )
          `)
          .eq('id', providerId)
          .single();

        if (fetchError) throw fetchError;

        // Transform the data to match the expected format
        const transformedProvider = {
          ...data,
          specializations: data?.provider_specializations?.map(
            (ps: ProviderSpecialization) => ps.specializations?.name
          ).filter(Boolean) || []
        };

        setProvider(transformedProvider);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching provider:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();

    // Set up real-time subscription
    const channel = supabase
      .channel(`provider-${providerId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'providers',
          filter: `id=eq.${providerId}`
        },
        () => fetchProvider()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [providerId]);

  return { provider, loading, error };
};

// Slots Hook
export const useProviderSlots = (providerId: string, sessionType?: string) => {
  const [slots, setSlots] = useState<TransformedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    const fetchSlots = async () => {
      try {
        let query = supabase
          .from('slots')
          .select('*')
          .eq('provider_id', providerId)
          .eq('status', 'available')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        if (sessionType) {
          query = query.eq('session_type', sessionType);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        
        // Transform slot data to match expected format
        const transformedSlots = (data || []).map((slot: Slot) => ({
          id: slot.id,
          date: slot.date,
          time: slot.start_time,
          duration: slot.duration_minutes || 45,
          available: slot.status === 'available',
          sessionType: slot.session_type,
          fee: slot.fee || 0
        }));

        setSlots(transformedSlots);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching slots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();

    // Set up real-time subscription
    const channel = supabase
      .channel(`slots-${providerId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'slots',
          filter: `provider_id=eq.${providerId}`
        },
        () => fetchSlots()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [providerId, sessionType]);

  return { slots, loading, error };
};

// Reviews Hook for provider ratings
export const useProviderReviews = (providerId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ rating: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('reviews')
          .select('*')
          .eq('provider_id', providerId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setReviews(data || []);
        
        // Calculate stats
        if (data && data.length > 0) {
          const avgRating = data.reduce((sum, review) => sum + (review.rating || 0), 0) / data.length;
          setStats({
            rating: Math.round(avgRating * 10) / 10,
            count: data.length
          });
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Set up real-time subscription
    const channel = supabase
      .channel(`reviews-${providerId}`)
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'reviews',
          filter: `provider_id=eq.${providerId}`
        },
        () => fetchReviews()
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [providerId]);

  return { reviews, stats, loading, error };
};

// Book Appointment Hook
export const useBookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bookAppointment = async (appointmentData: {
    provider_id: string;
    slot_id: string;
    client_id: string;
    appointment_date: string;
    appointment_time: string;
    session_type: string;
    session_mode: string;
    notes?: string;
    fee: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Create the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          status: 'scheduled',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Update the slot status to booked
      const { error: slotError } = await supabase
        .from('slots')
        .update({ status: 'booked' })
        .eq('id', appointmentData.slot_id);

      if (slotError) throw slotError;

      return appointment;
    } catch (err) {
      setError(err as Error);
      console.error('Error booking appointment:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { bookAppointment, loading, error };
};
