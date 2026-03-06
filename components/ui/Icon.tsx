// components/ui/Icon.tsx
// Complete SVG icon library for the Algerian Legal AI platform.
// All icons: 24x24 viewport, currentColor, strokeWidth 1.5–2, thin line style.
// No external icon library dependencies.

import React from 'react';

interface IconProps {
    className?: string;
    strokeWidth?: number;
}

// ── CATEGORY / LEGAL ICONS ──────────────────────────────────────────────────

/** Scales of justice — Civil Code, general legal, logo */
export function ScalesIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M12 3v18M4 7.5l4 8H4m12-8l4 8h-4M4 15.5h4M16 15.5h4M9 21h6" />
        </svg>
    );
}

/** Gavel / hammer — Criminal Code */
export function GavelIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M9 4L4 9l2 2 5-5-2-2zm5 5l-8 8 2 2 8-8-2-2zM5 19h14" />
        </svg>
    );
}

/** People / Users — Family Code */
export function UsersIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

/** Briefcase — Commercial Code */
export function BriefcaseIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-8 9v-4m0 0V9m0 3H9m3 0h3M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
    );
}

/** Hard hat — Labor Code */
export function HardHatIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M21 16v-4a9 9 0 00-18 0v4M3 16h18M5 20h14a1 1 0 001-1v-3H4v3a1 1 0 001 1z" />
        </svg>
    );
}

/** Building / columns — Administrative Code */
export function BuildingIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
        </svg>
    );
}

/** Open book — default/general */
export function BookOpenIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}

/** Document / file text */
export function DocumentIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

/** Document with checkmark */
export function DocumentCheckIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    );
}

/** Shield — Privacy / Data Protection */
export function ShieldIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );
}

// ── FEATURE ICONS ────────────────────────────────────────────────────────────

/** Magnifying glass — Search */
export function SearchIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

/** Globe — language / international */
export function GlobeIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

/** Heart — Free / open */
export function HeartIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}

/** Lightning bolt — Fast / instant */
export function LightningIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}

/** CPU / chip — AI processing */
export function CPUIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M9 3H7a2 2 0 00-2 2v2M9 3h6M9 3v2m6-2h2a2 2 0 012 2v2m0 0h2m-2 0v6m0 0h2m-2 0v2a2 2 0 01-2 2h-2m0 0H9m6 0v2M9 21H7a2 2 0 01-2-2v-2m0 0H3m2 0V9m14 6H9m0-6h6M9 9v6" />
        </svg>
    );
}

/** Edit pencil — step 1 (write question) */
export function WriteIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
    );
}

/** Chat bubble — Message */
export function MessageIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );
}

// ── NAVIGATION / UI ICONS ────────────────────────────────────────────────────

/** Home */
export function HomeIcon({ className = 'w-6 h-6', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );
}

/** Arrow left */
export function ArrowLeftIcon({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
    );
}

/** Arrow right */
export function ArrowRightIcon({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    );
}

/** Chevron right */
export function ChevronRightIcon({ className = 'w-5 h-5', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M9 5l7 7-7 7" />
        </svg>
    );
}

/** Chevron down */
export function ChevronDownIcon({ className = 'w-5 h-5', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

/** Checkmark */
export function CheckIcon({ className = 'w-5 h-5', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M5 13l4 4L19 7" />
        </svg>
    );
}

/** X / Close */
export function XIcon({ className = 'w-5 h-5', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

/** Plus */
export function PlusIcon({ className = 'w-5 h-5', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M12 4v16m8-8H4" />
        </svg>
    );
}

/** Edit / pencil */
export function EditIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    );
}

/** Trash / delete */
export function TrashIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

/** Eye — view */
export function EyeIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

/** User / profile */
export function UserIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

/** Mail / envelope */
export function MailIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

/** Lock / security */
export function LockIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}

/** Settings / cog */
export function SettingsIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

/** Bar chart / analytics */
export function BarChartIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );
}

/** Clock — time / recent */
export function ClockIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

/** Download */
export function DownloadIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );
}

/** Upload */
export function UploadIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    );
}

/** Send */
export function SendIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
    );
}

/** Refresh / retry */
export function RefreshIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    );
}

/** Copy / clipboard */
export function CopyIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
}

/** Star — rating */
export function StarIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    );
}

/** Help circle — FAQ */
export function HelpCircleIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

/** Phone */
export function PhoneIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );
}

/** Menu / hamburger */
export function MenuIcon({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    );
}

/** Filter */
export function FilterIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
    );
}

/** Chevron up-down / arrows — reorder */
export function ArrowUpDownIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
    );
}

/** Warning / alert triangle */
export function WarningIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );
}

/** Info circle */
export function InfoIcon({ className = 'w-5 h-5', strokeWidth = 1.5 }: IconProps) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

// ── CATEGORY ICON RESOLVER ───────────────────────────────────────────────────

/** Map category text → icon component */
export function getCategoryIcon(categoryName: string): React.ComponentType<IconProps> {
    const name = (categoryName || '').toLowerCase();
    if (name.includes('civil') || name.includes('مدني')) return ScalesIcon;
    if (name.includes('criminal') || name.includes('جزائي') || name.includes('عقوبات')) return GavelIcon;
    if (name.includes('family') || name.includes('أسرة') || name.includes('أسره')) return UsersIcon;
    if (name.includes('commercial') || name.includes('تجاري')) return BriefcaseIcon;
    if (name.includes('labor') || name.includes('عمل') || name.includes('عمال')) return HardHatIcon;
    if (name.includes('admin') || name.includes('إداري')) return BuildingIcon;
    if (name.includes('property') || name.includes('عقار')) return DocumentIcon;
    return BookOpenIcon;
}

// ── RE-EXPORTS FROM LEGACY PATH (backward compat) ───────────────────────────
// Components that import from @/components/icons/LegalIcons still work
export {
    ScalesIcon as ScalesIconLegacy,
    GavelIcon as GavelIconLegacy,
    UsersIcon as PeopleIcon,
    BriefcaseIcon as BriefcaseIconLegacy,
    HardHatIcon as HandshakeIcon,
    BuildingIcon as BuildingIconLegacy,
    BookOpenIcon as BookIcon,
    DocumentIcon as DocumentIconLegacy,
    SearchIcon as SearchIconLegacy,
    DocumentCheckIcon as DocumentCheckIconLegacy,
    GlobeIcon as GlobeIconLegacy,
    HeartIcon as FreeIcon,
    ShieldIcon as ShieldIconLegacy,
    LightningIcon as LightningIconLegacy,
    MessageIcon as ChatIcon,
    WriteIcon as WriteIconLegacy,
    CPUIcon as CPUIconLegacy,
};
