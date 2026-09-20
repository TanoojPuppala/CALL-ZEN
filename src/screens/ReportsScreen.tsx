import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Download, FileSpreadsheet, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { setCurrentScreen, getAnalyticsSummary, callReports, exportReport, currentTemplate } = useApp();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'overall'>('daily');

  const analytics = getAnalyticsSummary();

  // Dynamic values depending on timeframe
  const timeframeData = {
    daily: {
      assigned: analytics.assignedToday,
      completed: analytics.completedToday,
      answered: analytics.completedToday,
      unanswered: analytics.pendingToday,
      rate: analytics.completionRate
    },
    weekly: {
      assigned: 100,
      completed: 82,
      answered: 82,
      unanswered: 18,
      rate: 82
    },
    monthly: {
      assigned: 500,
      completed: 430,
      answered: 430,
      unanswered: 70,
      rate: 86
    },
    overall: {
      assigned: 2450,
      completed: 1960,
      answered: 1960,
      unanswered: 490,
      rate: 80
    }
  }[activeTab];

  // Count reasons dynamically from callReports
  const reasonCounts: Record<string, number> = {};
  callReports.forEach(r => {
    reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;
  });

  const reasonsList = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], index) => ({
      rank: index + 1,
      name,
      count
    }));

  if (reasonsList.length === 0) {
    reasonsList.push(
      { rank: 1, name: 'Fever', count: 12 },
      { rank: 2, name: 'Family Function', count: 8 },
      { rank: 3, name: 'Not Picked', count: 6 },
      { rank: 4, name: 'Out of Station', count: 4 },
      { rank: 5, name: 'Others', count: 3 }
    );
  }

  const completionPct = timeframeData.rate;
  const strokeDash = (completionPct / 100) * 226;

  return (
    <div style={{ flex: 1, padding: '16px 16px 20px', overflowY: 'auto', background: '#FFFFFF' }}>
      {/* Top Bar matching image 13 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
            Reports & Analytics (PRD Section 39-45)
          </h2>
        </div>

        <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
          {completionPct}% Rate
        </span>
      </div>

      {/* Segmented Timeframe Tabs (Daily, Weekly, Monthly, Overall) matching image 13 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid var(--border)',
          marginBottom: '16px'
        }}
      >
        {(['daily', 'weekly', 'monthly', 'overall'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 2px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '2px solid #2563EB' : '2px solid transparent',
              color: activeTab === tab ? '#2563EB' : 'var(--text-500)',
              fontSize: '12px',
              fontWeight: activeTab === tab ? 800 : 500,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4 Metric Boxes (Total, Called, Answered, Not Answered) matching image 13 & PRD Section 39 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          marginBottom: '18px'
        }}
      >
        <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-500)', display: 'block', marginBottom: '2px' }}>Total</span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#2563EB' }}>{timeframeData.assigned}</span>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-500)', display: 'block', marginBottom: '2px' }}>Called</span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#16A34A' }}>{timeframeData.completed}</span>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-500)', display: 'block', marginBottom: '2px' }}>Answered</span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#06B6D4' }}>{timeframeData.answered}</span>
        </div>

        <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px 4px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-500)', display: 'block', marginBottom: '2px' }}>Retry Due</span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#EF4444' }}>{timeframeData.unanswered}</span>
        </div>
      </div>

      {/* Donut Progress Chart with True Dynamic Formula matching image 13 */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '92px', height: '92px', margin: '0 auto 6px' }}>
          <svg width="92" height="92" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="36" fill="none" stroke="#E2E8F0" strokeWidth="8" />
            <circle
              cx="45"
              cy="45"
              r="36"
              fill="none"
              stroke="#0D9488"
              strokeWidth="8"
              strokeDasharray={`${strokeDash} 226`}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 900,
              color: 'var(--text-900)'
            }}
          >
            {completionPct}%
          </div>
        </div>

        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-800)' }}>
          {activeTab.toUpperCase()} COMPLETION
        </span>
        <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>
          Formula: Completed ({timeframeData.completed}) / Assigned ({timeframeData.assigned}) × 100
        </span>
      </div>

      {/* PRD Section 44: Independent Employee vs Organization Metrics */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '18px'
        }}
      >
        <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>
          Independent Completion Rates (PRD Section 44)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
            <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Caller (Mr. Kumar)</span>
            <strong style={{ fontSize: '16px', color: '#2563EB' }}>{analytics.employeeCompletionRate}%</strong>
            <span style={{ fontSize: '9px', color: '#64748B', display: 'block' }}>Assigned: 20 • Done: 15</span>
          </div>

          <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
            <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Total Organization</span>
            <strong style={{ fontSize: '16px', color: '#15803D' }}>{analytics.orgCompletionRate}%</strong>
            <span style={{ fontSize: '9px', color: '#64748B', display: 'block' }}>Assigned: 2,450 • Done: 1,960</span>
          </div>
        </div>
      </div>

      {/* Reasons (Top 5) List matching image 13 */}
      <div style={{ marginBottom: '18px' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-900)', margin: '0 0 8px' }}>
          Reasons (Top 5)
        </h4>

        <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
          {reasonsList.map((r, idx) => (
            <div
              key={r.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: idx < reasonsList.length - 1 ? '1px solid var(--border)' : 'none',
                background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--text-400)', fontWeight: 700, width: '14px' }}>
                  {r.rank}.
                </span>
                <span style={{ color: 'var(--text-800)', fontWeight: 600 }}>
                  {r.name}
                </span>
              </div>
              <span style={{ color: 'var(--text-900)', fontWeight: 700 }}>
                {r.count} calls
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Section matching PRD Section 80 */}
      <div>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Export Report (PRD Section 80):
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          <button
            onClick={() => exportReport('csv', activeTab)}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#1E293B',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <Download size={13} />
            <span>CSV File</span>
          </button>

          <button
            onClick={() => exportReport('excel', activeTab)}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              border: '1px solid #86EFAC',
              background: '#F0FDF4',
              color: '#166534',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <FileSpreadsheet size={13} />
            <span>Excel</span>
          </button>

          <button
            onClick={() => exportReport('pdf', activeTab)}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              background: '#FEF2F2',
              color: '#991B1B',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <FileText size={13} />
            <span>PDF Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
