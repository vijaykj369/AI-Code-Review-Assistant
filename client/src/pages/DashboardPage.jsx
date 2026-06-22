import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { reviewService } from '../services/reviewService';
import { repoService } from '../services/repoService';

function StatCard({ label, value, sub, valueClass = 'text-gray-200' }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </p>

      <p className={`text-2xl font-bold font-mono mb-1 ${valueClass}`}>
        {value}
      </p>

      <p className="text-xs text-gray-600">{sub}</p>
    </div>
  );
}

function QuickAction({ icon, label, desc, to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-start gap-4 p-5 bg-dark-surface border border-dark-border rounded-xl hover:bg-dark-hover hover:border-gray-500 transition-all text-left w-full"
    >
      <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(' ')[0] || 'there';

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const codeRes = await reviewService.getHistory({
          page: 1,
          limit: 10,
        });

        const repoRes = await repoService.getRepoHistory();

        const merged = [
          ...(codeRes?.reviews || []),
          ...(repoRes || []),
        ];

        merged.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        setRecent(merged.slice(0, 4));
      } catch (err) {
        console.error('Dashboard error:', err);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  const totalReviews = recent.length;

  const avgScore =
    recent.length > 0
      ? Math.round(
          recent.reduce((acc, r) => acc + (r.score || 0), 0) /
            recent.length
        )
      : 0;

  const totalIssues = recent.reduce((total, r) => {
    return (
      total +
      (r.bugs?.length || 0) +
      (r.securityIssues?.length || 0) +
      (r.performanceIssues?.length || 0)
    );
  }, 0);

  const totalRepos = recent.filter((r) => r.repoName).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-gray-200 mb-1">
          Good morning, {firstName}
        </h1>
        <p className="text-sm text-gray-500">
          Here's what's happening with your code reviews.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        <StatCard label="Total Reviews" value={totalReviews} sub="Recent activity" />

        <StatCard
          label="Avg Score"
          value={avgScore}
          sub="Based on latest reviews"
          valueClass="text-green-400"
        />

        <StatCard
          label="Issues Found"
          value={totalIssues}
          sub="Bugs + security + performance"
          valueClass="text-yellow-400"
        />

        <StatCard
          label="Repositories"
          value={totalRepos}
          sub="Repo reviews"
          valueClass="text-accent"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
        <QuickAction
          icon="⌨️"
          label="Paste & Review Code"
          desc="Instant AI code feedback"
          to="/review"
        />

        <QuickAction
          icon="🔗"
          label="Review GitHub Repo"
          desc="Analyze full repository"
          to="/repo"
        />
      </div>

      {/* RECENT */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-dark-border flex justify-between">
          <p className="text-sm text-gray-300">Recent Reviews</p>

          <button
            onClick={() => navigate('/history')}
            className="text-xs text-accent hover:underline"
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div className="p-5 text-gray-500">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="p-5 text-gray-500">No reviews yet</div>
        ) : (
          recent.map((r, i) => {
            const scoreClass =
              r.score >= 80
                ? 'text-green-400'
                : r.score >= 60
                ? 'text-yellow-400'
                : 'text-red-400';

            return (
              <div
                key={r._id || i}
                className="flex justify-between px-5 py-3 border-b border-dark-border last:border-0 hover:bg-dark-hover"
              >
                <div>
                  <p className="text-sm text-gray-300">
                    {r.repoName || r.language}
                  </p>

                  <p className="text-xs text-gray-500">
                    {r.summary?.slice(0, 60) || 'No summary'}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${scoreClass}`}>
                    {r.score}
                  </p>

                  <p className="text-xs text-gray-500">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}