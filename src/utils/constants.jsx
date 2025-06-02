// src/utils/constants.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  PARTIES: {
    BASE: '/parties',
    STATS: '/parties/stats',
    COMMENTS: (id) => `/parties/${id}/comments`,
    FOLLOW_UPS: (id) => `/parties/${id}/follow-ups`
  },
  QUOTATIONS: {
    BASE: '/quotations',
    STATS: '/quotations/stats',
    BY_PARTY: (partyId) => `/quotations/party/${partyId}`,
    REVISE: (id) => `/quotations/${id}/revise`
  },
  COMPONENTS: {
    BASE: '/components',
    SEARCH: '/components/search'
  },
  MODELS: {
    BASE: '/models',
    SEARCH: '/models/search'
  },
  CATEGORIES: '/categories',
  BRANDS: '/brands'
};

export const PARTY_SOURCES = [
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '📱' },
  { value: 'walk-in', label: 'Walk-in', icon: '🚶' },
  { value: 'referral', label: 'Referral', icon: '👥' },
  { value: 'website', label: 'Website', icon: '🌐' },
  { value: 'other', label: 'Other', icon: '📌' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low Priority', color: 'success', icon: '🟢' },
  { value: 'medium', label: 'Medium Priority', color: 'warning', icon: '🟡' },
  { value: 'high', label: 'High Priority', color: 'danger', icon: '🔴' }
];

export const DEAL_STATUSES = [
  { value: 'in_progress', label: 'In Progress', color: 'primary', icon: '⏳' },
  { value: 'won', label: 'Won', color: 'success', icon: '🎉' },
  { value: 'lost', label: 'Lost', color: 'danger', icon: '❌' },
  { value: 'on_hold', label: 'On Hold', color: 'warning', icon: '⏸️' }
];

export const QUOTATION_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'secondary' },
  { value: 'sent', label: 'Sent', color: 'primary' },
  { value: 'lost', label: 'Lost', color: 'danger' },
  { value: 'sold', label: 'Sold', color: 'success' }
];

export const COMMENT_TYPES = [
  { value: 'comment', label: 'General Note', icon: '💬' },
  { value: 'status_change', label: 'Status Change', icon: '🔄' },
  { value: 'priority_change', label: 'Priority Change', icon: '⚡' },
  { value: 'follow_up', label: 'Follow-up Note', icon: '📅' },
  { value: 'requirement_update', label: 'Requirement Update', icon: '📝' }
];

export const DEFAULT_TERMS_CONDITIONS = `Payment terms: 100% advance
Delivery: Within 7 working days
Warranty: As per manufacturer
GST: 18% extra (if applicable)
Transportation: Extra as per actual`;

export const CURRENCY_FORMAT = {
  locale: 'en-IN',
  currency: 'INR',
  options: {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }
};

export const DATE_FORMAT = {
  locale: 'en-IN',
  options: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata'
  }
};

