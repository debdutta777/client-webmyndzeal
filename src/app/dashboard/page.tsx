"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import RequireAuth from '@/components/RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  Star, 
  Bell, 
  Settings, 
  FileText,
  Play,
  ExternalLink,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Heart,
  Shield
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: string;
  provider: {
    name: string;
    type: 'Psychiatrist' | 'Psychologist' | 'counsellor' | 'Listener';
    image?: string;
    rating: number;
  };
  service?: {
    name: string;
    description: string;
    tier: string;
  };
  mode: 'video' | 'audio' | 'in-person';
  type: 'consultation' | 'therapy' | 'emergency' | 'listening';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  fee: number;
  notes?: string;
  meetingLink?: string;
  canJoin: boolean;
  sessionStarted?: boolean;
  isListener?: boolean;
}

interface Notification {
  id: string;
  type: 'appointment' | 'reminder' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AppointmentRow {
  id: string;
  appointment_date: string | Date;
  start_time?: string | null;
  duration?: number | null;
  provider_id?: string | null;
  slot_id?: string | null;
  status: string;
  payment_status?: string | null;
  amount?: number | null;
  session_mode?: 'video' | 'audio' | 'in_person' | 'online' | null;
  client_message?: string | null;
}

const statusConfig = {
  scheduled: { color: "blue", icon: Clock, bg: "bg-blue-100", text: "text-blue-700", label: "Scheduled" },
  completed: { color: "green", icon: CheckCircle, bg: "bg-green-100", text: "text-green-700", label: "Completed" },
  cancelled: { color: "red", icon: XCircle, bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
  no_show: { color: "orange", icon: AlertCircle, bg: "bg-orange-100", text: "text-orange-700", label: "No Show" },
  in_progress: { color: "purple", icon: Video, bg: "bg-purple-100", text: "text-purple-700", label: "In Progress" }
};

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'history'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const { client } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications] = useState<Notification[]>([]);
  const [, setLoading] = useState(false);

  // Fetch appointments for the logged-in client
  useEffect(() => {
    const load = async () => {
      if (!client?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('id, appointment_date, start_time, duration, provider_id, slot_id, status, payment_status, amount, session_mode, client_message')
          .eq('client_id', client.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: Appointment[] = (data || []).map((a: AppointmentRow) => {
          // Map DB statuses to UI statuses
          const uiStatus: Appointment['status'] = ((): Appointment['status'] => {
            switch (a.status) {
              case 'completed':
                return 'completed';
              case 'cancelled':
                return 'cancelled';
              case 'no_show':
                return 'no_show';
              case 'in_progress':
                return 'in_progress';
              case 'confirmed': // treat confirmed as upcoming for UI
              case 'scheduled':
              default:
                return 'scheduled';
            }
          })();

          const isListener = !a.provider_id; // heuristic for listening sessions
          const mode: Appointment['mode'] = a.session_mode === 'in_person' ? 'in-person' : 'video';

          return {
            id: a.id,
            date: typeof a.appointment_date === 'string' ? a.appointment_date : new Date(a.appointment_date).toISOString().split('T')[0],
            time: a.start_time || '',
            duration: `${a.duration || 45} mins`,
            provider: isListener ? { name: 'Listening Service', type: 'Listener', rating: 5 } : { name: 'Provider', type: 'counsellor', rating: 5 },
            service: isListener ? { name: 'Listening Session', description: 'Anonymous & Confidential', tier: 'N/A' } : undefined,
            mode,
            type: isListener ? 'listening' : 'consultation',
            status: uiStatus,
            fee: Number(a.amount) || 0,
            notes: a.client_message || undefined,
            meetingLink: undefined,
            canJoin: uiStatus === 'scheduled' || uiStatus === 'in_progress',
            sessionStarted: uiStatus === 'in_progress',
            isListener,
          } as Appointment;
        });

        setAppointments(mapped);
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [client?.id]);

  const stats = useMemo(() => {
    const totalSessions = appointments.length;
    const upcomingSessions = appointments.filter(a => a.status === 'scheduled' || a.status === 'in_progress').length;
    const completedSessions = appointments.filter(a => a.status === 'completed').length;

    // Prefer computing spend from appointments with payment_status completed to avoid schema drift in payments
    const totalSpentFromAppointments = appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.fee || 0), 0);

    return {
      totalSessions,
      upcomingSessions,
      completedSessions,
      totalSpent: totalSpentFromAppointments,
    };
  }, [appointments]);

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled' || a.status === 'in_progress');

  const handleJoinSession = (appointment: Appointment) => {
    // Route to in-app video page (Option A)
    window.location.href = `/appointments/${appointment.id}/video`;
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-[#F4FAF2] to-[#E8F4F8]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2D3319]">Welcome back, {client?.firstName || 'User'}</h1>
              <p className="text-gray-600 mt-1">Manage your mental health journey</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b border-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Profile Menu */}
              <Link href="/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{(client?.firstName || 'U').charAt(0)}</span>
                </div>
                <Settings className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8 max-w-md">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'appointments', label: 'Appointments' },
              { key: 'history', label: 'History' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'overview' | 'appointments' | 'history')}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.upcomingSessions}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stats.completedSessions}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Star className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹{stats.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/services" className="group p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#8BA872] transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-[#8BA872]/10 group-hover:bg-[#8BA872]/20 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-[#8BA872]" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Book Appointment</h3>
                    <p className="text-sm text-gray-600">Schedule a new session</p>
                  </div>
                </Link>

                <Link href="/services" className="group p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#8BA872] transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-[#8BA872]/10 group-hover:bg-[#8BA872]/20 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-[#8BA872]" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Find Providers</h3>
                    <p className="text-sm text-gray-600">Browse specialists</p>
                  </div>
                </Link>

                <Link href="/reports" className="group p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#8BA872] transition-colors">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-lg bg-[#8BA872]/10 group-hover:bg-[#8BA872]/20 flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-[#8BA872]" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">View Reports</h3>
                    <p className="text-sm text-gray-600">Session summaries</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                <Link href="#" onClick={() => setActiveTab('appointments')} className="text-[#8BA872] font-medium hover:text-[#73905B] transition-colors">
                  View All
                </Link>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No upcoming appointments</p>
                  <Link href="/services" className="inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all">
                    Book Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} onJoin={handleJoinSession} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Your Appointments</h2>
              <Link href="/services" className="px-4 py-2 bg-gradient-to-r from-[#8BA872] to-[#73905B] text-white rounded-lg font-medium hover:shadow-md transition-all">
                Book New Session
              </Link>
            </div>

            <div className="space-y-4">
              {appointments.filter(a => a.status === 'scheduled' || a.status === 'in_progress').map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} onJoin={handleJoinSession} detailed />
              ))}
            </div>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900">Session History</h2>

            <div className="space-y-4">
              {appointments.filter(a => a.status === 'completed' || a.status === 'cancelled').map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} onJoin={handleJoinSession} detailed history />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </RequireAuth>
  );
}

// Appointment Card Component
function AppointmentCard({ 
  appointment, 
  onJoin, 
  detailed = false, 
  history = false 
}: { 
  appointment: Appointment;
  onJoin: (appointment: Appointment) => void;
  detailed?: boolean;
  history?: boolean;
}) {
  const StatusIcon = statusConfig[appointment.status].icon;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Provider/Service Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8BA872] to-[#73905B] flex items-center justify-center flex-shrink-0">
            {appointment.isListener ? (
              <Heart className="w-6 h-6 text-white" />
            ) : (
              <span className="text-white font-semibold">{appointment.provider.name.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                {appointment.isListener ? (
                  // Show service details for listeners
                  <>
                    <h3 className="font-semibold text-gray-900">{appointment.service?.name}</h3>
                    <p className="text-sm text-gray-600">{appointment.service?.description}</p>
                    <div className="flex items-center mt-1">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-blue-600 ml-1">Anonymous Session</span>
                    </div>
                  </>
                ) : (
                  // Show provider details for other types
                  <>
                    <h3 className="font-semibold text-gray-900">{appointment.provider.name}</h3>
                    <p className="text-sm text-gray-600">{appointment.provider.type}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{appointment.provider.rating}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig[appointment.status].bg}`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig[appointment.status].text}`} />
                <span className={`text-sm font-medium ${statusConfig[appointment.status].text}`}>
                  {statusConfig[appointment.status].label}
                </span>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{appointment.time} ({appointment.duration})</span>
              </div>
              <div className="flex items-center space-x-2">
                {appointment.mode === 'video' ? <Video className="w-4 h-4 text-gray-400" /> : 
                 appointment.mode === 'audio' ? <Phone className="w-4 h-4 text-gray-400" /> : 
                 <MapPin className="w-4 h-4 text-gray-400" />}
                <span className="text-gray-600 capitalize">{appointment.mode}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">₹{appointment.fee}</span>
              </div>
            </div>

            {detailed && appointment.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4">
          {appointment.status === 'in_progress' && appointment.canJoin && (
            <button
              onClick={() => onJoin(appointment)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Join Now</span>
            </button>
          )}
          
          {appointment.status === 'scheduled' && appointment.canJoin && (
            <button
              onClick={() => onJoin(appointment)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Join Session</span>
            </button>
          )}

          {history && appointment.status === 'completed' && (
            <Link href={`/reports/${appointment.id}`} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              <span>View Report</span>
            </Link>
          )}

          {!history && appointment.status === 'scheduled' && (
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Reschedule</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
