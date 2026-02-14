import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import LoyaltyCardMobile from './LoyaltyCardMobile';
import { gsap } from 'gsap';
import UserTasksModal from './UserTaskManeger';

interface UserStats {
  package: string;
  totalWebinars: number;
  thisMonthWebinars: number;
  lastMonthWebinars: number;
  monthlyGrowth: number;
  orders: {
    total: number;
    pending: number;
    approved: number;
    shipped: number;
    delivered: number;
    rejected: number;
  };
  expiryDate: string;
  monthsLeft: number;
  totalTasks?: number;
  completedTasks?: number;
}

interface Props {
  userCoins: number;
}

const UserStatsCards: React.FC<Props> = ({ userCoins }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [openTasksModal, setOpenTasksModal] = useState(false);

  const cardsRef = useRef<(HTMLDivElement | HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BackendUrl}/auth/user-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ INITIAL FETCH
  useEffect(() => {
    fetchUserStats();
  }, []);

  // ✅ NEW: AUTO-REFRESH EVERY 30 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserStats();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (stats && !loading) {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
          rotateX: -15,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.15,
          clearProps: 'all',
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const numberElement = card.querySelector('.stat-number');
        if (numberElement) {
          const targetValue = parseInt(numberElement.textContent || '0');
          gsap.from(numberElement, {
            textContent: 0,
            duration: 1.5,
            delay: 0.15 * index,
            ease: 'power1.out',
            snap: { textContent: 1 },
            onUpdate: function () {
              // @ts-ignore
              numberElement.textContent = Math.floor(
                Number(this.targets()[0].textContent)
              ).toString();
            },
          });
        }
      });
    }
  }, [stats, loading]);

  const getPackageGradient = (packageName: string) => {
    const pkg = packageName?.toLowerCase() || 'free';
    if (pkg === 'test') return 'from-gray-200 to-gray-400';
    if (pkg === 'infa') return 'from-indigo-400 to-indigo-700';
    if (pkg === 'gold') return 'from-yellow-400 to-yellow-600';
    if (pkg === 'silver') return 'from-gray-300 to-gray-500';
    if (pkg === 'gold+') return 'from-yellow-500 to-orange-600';
    if (pkg === 'elite') return 'from-purple-500 to-pink-500';
    if (pkg === 'supreme') return 'from-red-500 to-yellow-500';
    return 'from-blue-400 to-blue-600';
  };

  if (loading || !stats) {
    return (
      <section ref={sectionRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ✅ UPDATED: Smart order status text with priority
  const getOrderStatusText = () => {
    if (!stats) return { text: 'No Orders', color: 'text-gray-500' };

    const { orders } = stats;

    // Priority: Pending > Shipped > Rejected > Delivered > No orders
    if (orders.pending > 0) {
      return { 
        text: `${orders.pending} Pending`, 
        color: 'text-yellow-600',
        icon: '⏳'
      };
    }
    
    if (orders.shipped > 0) {
      return { 
        text: `${orders.shipped} Shipped`, 
        color: 'text-blue-600',
        icon: '🚚'
      };
    }

    // ✅ NEW: Show rejected orders
    if (orders.rejected > 0) {
      return { 
        text: `${orders.rejected} Rejected`, 
        color: 'text-red-600',
        icon: '❌'
      };
    }

    if (orders.delivered > 0) {
      return { 
        text: `${orders.delivered} Delivered`, 
        color: 'text-green-600',
        icon: '✅'
      };
    }

    return { 
      text: 'No Active Orders', 
      color: 'text-gray-500',
      icon: '📦'
    };
  };

  const orderStatus = getOrderStatusText();

  const totalTasks = stats.totalTasks ?? 0;
  const completedTasks = stats.completedTasks ?? 0;

  return (
    <>
      <section ref={sectionRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Package */}
          <div
            ref={(el) => (cardsRef.current[0] = el)}
            className={`bg-gradient-to-br ${getPackageGradient(
              stats.package
            )} p-6 rounded-xl text-white shadow-lg hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Current Package</h3>
                <p className="text-2xl font-bold stat-package">{stats.package}</p>
                <p className="text-xs opacity-75">Premium Access</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Task Completion */}
          <button
            ref={(el) => (cardsRef.current[1] = el)}
            onClick={() => setOpenTasksModal(true)}
            className="relative group bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl shadow-lg border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full bg-emerald-400 group-hover:w-96 group-hover:h-96 transition-all duration-700"></div>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-emerald-700 group-hover:text-emerald-900 transition-colors">
                    Task Completion
                  </h3>
                  <svg 
                    className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-emerald-700 stat-number group-hover:text-emerald-800 transition-colors">
                  {completedTasks}
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  {totalTasks > 0
                    ? `${completedTasks}/${totalTasks} tasks completed`
                    : 'No tasks assigned yet'}
                </p>
                <p className="text-[10px] text-emerald-500 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view tasks →
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {totalTasks > 0 && (
              <div className="relative z-10 mt-4 w-full h-2 bg-emerald-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 group-hover:shadow-lg"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                ></div>
              </div>
            )}
          </button>

          {/* ✅ UPDATED: Product Orders Card */}
          <div
            ref={(el) => (cardsRef.current[2] = el)}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer relative"
          >
            {/* ✅ NEW: Visual indicator for rejected orders */}
            {stats.orders.rejected > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Product Orders</h3>
                <p className="text-2xl font-bold text-purple-600 stat-number">
                  {stats.orders.total}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg">{orderStatus.icon}</span>
                  <p className={`text-xs font-medium ${orderStatus.color}`}>
                    {orderStatus.text}
                  </p>
                </div>

                {/* ✅ NEW: Show breakdown if multiple statuses */}
                {stats.orders.total > 1 && (
                  <div className="mt-2 text-[10px] text-gray-500 space-y-0.5">
                    {stats.orders.delivered > 0 && (
                      <div>✅ {stats.orders.delivered} Delivered</div>
                    )}
                    {stats.orders.rejected > 0 && (
                      <div className="text-red-600 font-semibold">
                        ❌ {stats.orders.rejected} Rejected
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Valid Until */}
          <div
            ref={(el) => (cardsRef.current[3] = el)}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Valid Until</h3>
                <p className="text-2xl font-bold text-green-600">{stats.expiryDate}</p>
                <p className="text-xs text-green-600 stat-months">
                  {stats.monthsLeft} months left
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Loyalty Card - Only on mobile */}
          <div className="block lg:hidden">
            <LoyaltyCardMobile coins={userCoins} />
          </div>
        </div>
      </section>

      {openTasksModal && (
        <UserTasksModal
          setOpenTasksModal={setOpenTasksModal}
          refreshUserStats={fetchUserStats}
        />
      )}
    </>
  );
};

export default UserStatsCards;
