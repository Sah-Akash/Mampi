import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 130,
  strokeWidth = 10,
  color = '#C5A059',
  bgColor = '#EFE9DE',
  label,
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Determine dynamic ring color based on budget health
  let strokeColor = color;
  if (percentage > 100) {
    strokeColor = '#DC2626'; // Red for over budget
  } else if (percentage >= 85) {
    strokeColor = '#D97706'; // Amber for high warning
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="dark:stroke-[#2E2823] transition-colors"
        />
        {/* Animated Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2C2523] dark:text-[#F3EEEA]">
          {label ?? `${percentage}%`}
        </span>
        {sublabel && (
          <span className="text-[11px] font-medium text-[#7D7067] dark:text-[#A89F97] leading-tight">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
