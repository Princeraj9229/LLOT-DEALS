import React from 'react';

/**
 * High-fidelity festive divine artwork depicting:
 * 1. Bhagwan Surya Dev on 7-horse chariot rising at sunrise (Chhath Puja)
 * 2. Grand Golden Pratima of Maa Durga with Mahishasuramardini & Lion (Durga Puja)
 * 3. Radiant Diwali Golden Diyas & Festive Lights
 */

export const DivineSuryaChhathArtwork: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 800 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      {/* Sky & Sunrise Gradients */}
      <linearGradient id="skyGrad" x1="400" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F97316" />
        <stop offset="0.4" stopColor="#FB923C" />
        <stop offset="0.75" stopColor="#FDBA74" />
        <stop offset="1" stopColor="#FEF08A" />
      </linearGradient>
      {/* Sun Core */}
      <radialGradient id="sunGlow" cx="400" cy="380" r="180" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFBEB" />
        <stop offset="0.3" stopColor="#FEF08A" />
        <stop offset="0.6" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#EA580C" stopOpacity="0" />
      </radialGradient>
      {/* Holy Waters */}
      <linearGradient id="waterGrad" x1="400" y1="380" x2="400" y2="600" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EA580C" />
        <stop offset="0.3" stopColor="#C2410C" />
        <stop offset="0.7" stopColor="#9A3412" />
        <stop offset="1" stopColor="#7C2D12" />
      </linearGradient>
      {/* Golden Chariot */}
      <linearGradient id="goldChariot" x1="300" y1="180" x2="500" y2="350" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="0.5" stopColor="#EAB308" />
        <stop offset="1" stopColor="#CA8A04" />
      </linearGradient>
      {/* Horses White / Gold */}
      <linearGradient id="horseWhite" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FDE68A" />
      </linearGradient>
    </defs>

    {/* Sky */}
    <rect width="800" height="400" fill="url(#skyGrad)" />

    {/* Sacred Rising Sun */}
    <circle cx="400" cy="380" r="140" fill="url(#sunGlow)" />
    <circle cx="400" cy="380" r="55" fill="#FFFBEB" />

    {/* Holy River Waters with Sun Reflection */}
    <rect y="380" width="800" height="220" fill="url(#waterGrad)" />
    {/* Water ripples */}
    <path
      d="M200 410C300 405 500 405 600 410M150 440C280 435 520 435 650 440M100 480C250 475 550 475 700 480M50 530C220 525 580 525 750 530"
      stroke="#FEF08A"
      strokeWidth="2.5"
      strokeOpacity="0.6"
      strokeLinecap="round"
    />

    {/* Radiant Surya Dev Halo & Crown */}
    <circle cx="400" cy="140" r="75" fill="#FEF08A" fillOpacity="0.4" />
    <circle cx="400" cy="140" r="60" fill="#FDE047" fillOpacity="0.6" />

    {/* Seven Horses Chariot Base */}
    <path
      d="M280 280C280 230 520 230 520 280L550 360C450 380 350 380 250 360L280 280Z"
      fill="url(#goldChariot)"
    />

    {/* Seven Sacred Horses */}
    {[-150, -100, -50, 0, 50, 100, 150].map((offset, i) => (
      <g key={i} transform={`translate(${400 + offset}, 335)`}>
        {/* Horse Head & Mane */}
        <path
          d="M-15 15C-15 0 -8 -15 0 -22C8 -15 15 0 15 15C12 25 -12 25 -15 15Z"
          fill="url(#horseWhite)"
          stroke="#B45309"
          strokeWidth="1.2"
        />
        {/* Bridle & Jewel */}
        <circle cx="0" cy="-5" r="3" fill="#DC2626" />
        <path d="M-8 8C0 14 0 14 8 8" stroke="#D97706" strokeWidth="1.5" />
      </g>
    ))}

    {/* Bhagwan Surya Dev Deity Form */}
    {/* Body & Silken Attire */}
    <path
      d="M360 210C360 170 440 170 440 210L455 270H345L360 210Z"
      fill="#16A34A"
      stroke="#EAB308"
      strokeWidth="2"
    />
    <path
      d="M375 220C375 190 425 190 425 220L435 270H365L375 220Z"
      fill="#DC2626"
    />

    {/* Golden Ornaments & Garland */}
    <path
      d="M370 190C400 220 400 220 430 190"
      stroke="#FEF08A"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="400" cy="210" r="5" fill="#EF4444" />

    {/* Divine Face & Crown */}
    <circle cx="400" cy="140" r="26" fill="#FED7AA" />
    {/* Mukut (Crown) */}
    <path
      d="M375 125L400 70L425 125Z"
      fill="#FBBF24"
      stroke="#B45309"
      strokeWidth="1.5"
    />
    <circle cx="400" cy="85" r="4" fill="#DC2626" />
    {/* Holy Red Flag atop chariot */}
    <path d="M490 80V250M490 80L535 100L490 120" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
  </svg>
);

export const GrandDurgaPratimaArtwork: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 1,
}) => (
  <svg
    viewBox="0 0 800 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity }}
  >
    <defs>
      {/* Pandal Backdrop */}
      <radialGradient id="pandalBackdrop" cx="400" cy="280" r="320" gradientUnits="userSpaceOnUse">
        <stop stopColor="#991B1B" />
        <stop offset="0.6" stopColor="#7F1D1D" />
        <stop offset="1" stopColor="#450A0A" />
      </radialGradient>
      {/* Golden Chalchitra Arch */}
      <linearGradient id="goldArch" x1="150" y1="50" x2="650" y2="400" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FEF08A" />
        <stop offset="0.4" stopColor="#FACC15" />
        <stop offset="0.8" stopColor="#EAB308" />
        <stop offset="1" stopColor="#A16207" />
      </linearGradient>
      <linearGradient id="sariRed" x1="350" y1="200" x2="450" y2="450" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF4444" />
        <stop offset="0.7" stopColor="#DC2626" />
        <stop offset="1" stopColor="#B91C1C" />
      </linearGradient>
    </defs>

    {/* Royal Crimson Pandal Background */}
    <rect width="800" height="600" fill="url(#pandalBackdrop)" />

    {/* Grand Golden Chalchitra (Ornate Arch) */}
    <path
      d="M160 500C160 220 250 80 400 80C550 80 640 220 640 500"
      stroke="url(#goldArch)"
      strokeWidth="24"
      strokeLinecap="round"
    />
    <path
      d="M190 500C190 260 270 120 400 120C530 120 610 260 610 500"
      stroke="#FEF08A"
      strokeWidth="6"
      strokeDasharray="12 12"
    />

    {/* Maa Durga Radiant Aura */}
    <circle cx="400" cy="220" r="95" fill="#FEF08A" fillOpacity="0.25" />
    <circle cx="400" cy="220" r="70" fill="#FACC15" fillOpacity="0.4" />

    {/* Grand Golden Mukut (Crown) */}
    <path
      d="M350 160L400 65L450 160Z"
      fill="url(#goldArch)"
      stroke="#78350F"
      strokeWidth="2"
    />
    <circle cx="400" cy="115" r="7" fill="#DC2626" />
    <circle cx="380" cy="145" r="5" fill="#DC2626" />
    <circle cx="420" cy="145" r="5" fill="#DC2626" />

    {/* Maa Durga Divine Face */}
    <ellipse cx="400" cy="205" rx="36" ry="42" fill="#FED7AA" />
    {/* Divine Eyes & Third Eye */}
    <path d="M375 198C385 190 395 195 398 200C392 205 380 205 375 198Z" fill="#1E1B4B" />
    <circle cx="387" cy="198" r="3" fill="#FFF" />
    <path d="M425 198C415 190 405 195 402 200C408 205 420 205 425 198Z" fill="#1E1B4B" />
    <circle cx="413" cy="198" r="3" fill="#FFF" />
    {/* Sacred Red Bindi / Trinetra */}
    <ellipse cx="400" cy="180" rx="3.5" ry="6" fill="#DC2626" />

    {/* Traditional Golden Nose Ring (Nath) */}
    <circle cx="408" cy="210" r="7" stroke="#FBBF24" strokeWidth="2" fill="none" />

    {/* Ten Arms holding Divine Astra & Trishul */}
    {/* Golden Trishul (Trident) */}
    <path d="M340 100L440 480" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />
    <path
      d="M320 110C340 70 340 70 350 120M340 70V140M360 110C340 70 340 70 330 120"
      stroke="#FDE047"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Multiple Divine Arms */}
    <path
      d="M320 220C270 200 250 240 240 280M320 250C260 250 230 310 240 340M480 220C530 200 550 240 560 280M480 250C540 250 570 310 560 340"
      stroke="#FDBA74"
      strokeWidth="10"
      strokeLinecap="round"
    />

    {/* Golden Ornaments & Bangles */}
    <circle cx="240" cy="280" r="10" fill="#FBBF24" />
    <circle cx="560" cy="280" r="10" fill="#FBBF24" />

    {/* Royal Saree & Ornate Golden Armor */}
    <path
      d="M340 250C340 250 330 380 320 490C400 510 400 510 480 490C470 380 460 250 460 250Z"
      fill="url(#sariRed)"
      stroke="#FACC15"
      strokeWidth="3"
    />
    {/* Heavy Golden Necklace (Dokra / Zari) */}
    <path
      d="M360 240C400 290 400 290 440 240"
      stroke="#FDE047"
      strokeWidth="8"
      strokeLinecap="round"
    />
    <path
      d="M370 260C400 310 400 310 430 260"
      stroke="#EAB308"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Royal Lion Vahana */}
    <path
      d="M260 480C260 400 350 420 380 480C360 520 280 530 260 480Z"
      fill="#D97706"
      stroke="#92400E"
      strokeWidth="2"
    />
    <circle cx="340" cy="450" r="28" fill="#B45309" />
    <circle cx="350" cy="450" r="16" fill="#F59E0B" />

    {/* Mahishasura Figure Below */}
    <path
      d="M440 450C480 420 540 480 490 520L430 480Z"
      fill="#047857"
      stroke="#065F46"
      strokeWidth="2"
    />

    {/* Base Lotus Pedestal */}
    <path
      d="M120 520C280 500 520 500 680 520L720 580H80L120 520Z"
      fill="url(#goldArch)"
    />
    {/* Lotus Petals */}
    {[-200, -100, 0, 100, 200].map((x, i) => (
      <path
        key={i}
        d={`M${400 + x - 35} 520C${400 + x} 490 ${400 + x} 490 ${400 + x + 35} 520Z`}
        fill="#F43F5E"
        stroke="#E11D48"
        strokeWidth="1.5"
      />
    ))}
  </svg>
);
