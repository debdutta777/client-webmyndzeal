import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Provider, Slot, Review, TransformedSlot } from '@/types/supabase';

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
        // Fetch provider with their degrees
        const { data, error: fetchError } = await supabase
          .from('providers')
          .select('*, provider_degrees(*)')
          .eq('id', providerId)
          .single();

        if (fetchError) {
          console.warn('Error fetching provider:', fetchError);
          setProvider(null);
          return;
        }

        // Format qualifications from degrees
        let qualifications = '';
        if (data?.provider_degrees && Array.isArray(data.provider_degrees)) {
          qualifications = data.provider_degrees
            .map((degree: any) => `${degree.degree_name} - ${degree.university} (${degree.year})`)
            .join(', ');
        }

        // Transform the data to match the expected format
        const transformedProvider = {
          ...data,
          // specializations is already an array in the providers table
          full_name: `${data?.first_name || ''} ${data?.last_name || ''}`.trim(),
          name: `${data?.first_name || ''} ${data?.last_name || ''}`.trim(),
          years_of_experience: data?.experience_years || 0,
          consultation_fee: data?.default_fee || 0,
          therapy_fee: data?.default_fee || 0,
          emergency_fee: (data?.default_fee || 0) * 1.5,
          verified: data?.status === 'verified',
          qualifications: qualifications // Only show degrees, no fallback to registration number
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
          .eq('status', 'approved')  // Only approved slots
          .eq('is_booked', false)     // Only non-booked slots
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        if (sessionType) {
          query = query.eq('session_type', sessionType);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          // Don't throw if no slots found, just return empty array
          console.warn('Error fetching slots:', fetchError);
          setSlots([]);
          return;
        }
        
        // Transform slot data to match expected format
        const transformedSlots = (data || []).map((slot: any) => ({
          id: slot.id,
          date: slot.date,
          time: slot.start_time,
          duration: slot.duration || 45,
          available: !slot.is_booked,
          sessionType: slot.session_type || 'consultation',
          fee: slot.total_fee || slot.base_fee || 0
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

  // Utility helpers
  const toHHMMSS = (t: string) => (/^\d{2}:\d{2}:\d{2}$/.test(t) ? t : `${t}:00`);
  const addMinutes = (time: string, mins: number) => {
    const [h, m] = time.split(':').map((x) => parseInt(x, 10));
    const d = new Date(0, 0, 0, h, m, 0);
    d.setMinutes(d.getMinutes() + mins);
    const hh = `${d.getHours()}`.padStart(2, '0');
    const mm = `${d.getMinutes()}`.padStart(2, '0');
    return `${hh}:${mm}:00`;
  };

  const bookAppointment = async (appointmentData: {
    provider_id: string;
    slot_id: string;
    client_id: string; // MUST be public.users.id (not auth.users.id)
    appointment_date: string;
    appointment_time: string; // legacy input; we map to start_time
    session_type: string;
    session_mode: string;
    notes?: string; // mapped to client_message
    fee: number; // mapped to amount
    status?: string; // ignored; we always use 'scheduled' initially
    payment_status?: string;
    duration?: number; // optional; if missing, we read from slot
  }) => {
    setLoading(true);
    setError(null);

    interface AppointmentInsert {
      provider_id: string;
      slot_id: string;
      client_id: string;
      appointment_date: string;
      start_time: string;
      end_time: string;
      duration: number;
      session_type: string;
      session_mode: string;
      client_message: string | null;
      amount: number;
      status: 'scheduled';
      payment_status: string;
      created_at: string;
    }

    try {
      // Resolve duration and end_time
      let duration = appointmentData.duration;
      if (!duration && appointmentData.slot_id) {
        const { data: slotRow } = await supabase
          .from('slots')
          .select('duration')
          .eq('id', appointmentData.slot_id)
          .single();
        if (slotRow?.duration) duration = slotRow.duration;
      }
      if (!duration) duration = 45; // sensible default

      const start_time = toHHMMSS(appointmentData.appointment_time);
      const end_time = addMinutes(start_time, duration);

      // Create the appointment aligned to DB schema
      const insertRow: AppointmentInsert = {
        provider_id: appointmentData.provider_id,
        slot_id: appointmentData.slot_id,
        client_id: appointmentData.client_id,
        appointment_date: appointmentData.appointment_date,
        start_time,
        end_time,
        duration,
        session_type: appointmentData.session_type,
        session_mode: appointmentData.session_mode,
        client_message: appointmentData.notes ?? null,
        amount: appointmentData.fee,
        status: 'scheduled', // always start as scheduled; payment flow will confirm
        payment_status: appointmentData.payment_status || 'pending',
        created_at: new Date().toISOString()
      };

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([insertRow])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // No direct slot update here; DB trigger marks is_booked = true automatically.
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
