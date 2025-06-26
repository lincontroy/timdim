import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];





export default function Dashboard() {


  const [customerCount, setCustomerCount] = useState<number>(0);
  const [disbursedWeek, setDisbursedWeek] = useState<number>(0);
  const [disbursedMonth, setDisbursedMonth] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [repaidWeek, setRepaidWeek] = useState<number>(0);
  const [pendingApprovalsTotal, setPendingApprovalsTotal] = useState<number>(0);
  const [chartData, setChartData] = useState([]);

const [repaidMonth, setRepaidMonth] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customerRes, disbursementRes,repaymentRes,pendingApprovalsTotal] = await Promise.all([
          axios.get('/api/customer-count'),
          axios.get('/api/loan-disbursement-summary'),
          axios.get('/api/repayment-summary'),
          axios.get('/api/loan-pending-total')
        ]);

        setCustomerCount(customerRes.data.count);
        setDisbursedWeek(disbursementRes.data.week);
        setDisbursedMonth(disbursementRes.data.month);
        setRepaidWeek(repaymentRes.data.week);
        setRepaidMonth(repaymentRes.data.month);
        setPendingApprovalsTotal(pendingApprovalsTotal.data.pending);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



useEffect(() => {
  const fetchChartData = async () => {
    try {
      const res = await axios.get('/api/loan-trends');
      const disbursed = res.data.disbursed;
      const repaid = res.data.repaid;

      // Merge by month
      const merged: Record<string, { month: string, disbursed?: number, repaid?: number }> = {};

      disbursed.forEach((entry: any) => {
        merged[entry.month] = { ...(merged[entry.month] || {}), month: entry.month, disbursed: +entry.total };
      });

      repaid.forEach((entry: any) => {
        merged[entry.month] = { ...(merged[entry.month] || {}), month: entry.month, repaid: +entry.total };
      });

      // Convert to array and sort
      const result = Object.values(merged).sort((a, b) => a.month.localeCompare(b.month));
    //   console.log(result)
      
      setChartData(result);
    } catch (err) {
      console.error('Failed to load chart data', err);
    }
  };

  fetchChartData();
}, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Customers */}
            <div className="rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Customers</h2>
              <p className="mt-2 text-3xl font-bold">{customerCount.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-blue-100">Currently borrowing</span>
            </div>
      
            {/* Loans Disbursed This Week */}
            <div className="rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Disbursed This Week</h2>
              <p className="mt-2 text-3xl font-bold">KES {disbursedWeek.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-green-100">Loans sent</span>
            </div>
      
            {/* Loans Disbursed This Month */}
            <div className="rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Disbursed This Month</h2>
              <p className="mt-2 text-3xl font-bold">KES {disbursedMonth.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-teal-100">Loans sent</span>
            </div>
      
            {/* Loans Repaid This Week */}
            <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Repaid This Week</h2>
              <p className="mt-2 text-3xl font-bold">KES {repaidWeek.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-purple-100">Collected repayments</span>
            </div>
      
            {/* Loans Repaid This Month */}
            <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Repaid This Month</h2>
              <p className="mt-2 text-3xl font-bold">KES {repaidMonth.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-indigo-100">Collected repayments</span>
            </div>
      
            {/* Pending Approvals */}
            <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 shadow-md">
              <h2 className="text-xl font-semibold">Pending Approvals</h2>
              <p className="mt-2 text-3xl font-bold">{pendingApprovalsTotal.toLocaleString()}</p>
              <span className="block mt-1 text-sm text-yellow-100">Loan requests</span>
            </div>
          </div>
      
          {/* Loan Performance Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-900">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Loan Performance Summary</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              An overview of repayment trends, delinquencies, and monthly disbursements.
            </p>
      
            {/* Placeholder for Chart or Graph */}
            <div className="mt-6 h-64 w-full rounded-lg bg-white dark:bg-gray-900 p-4 shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Loan Disbursement vs Repayment</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(val) => `KES ${val / 1000}K`} />
                    <Tooltip formatter={(value: number) => `KES ${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="disbursed" stroke="#4ade80" name="Disbursed" />
                    <Line type="monotone" dataKey="repaid" stroke="#6366f1" name="Repaid" />
                    </LineChart>
                </ResponsiveContainer>
                </div>

          </div>
        </div>
      </AppLayout>
      
    );
}
