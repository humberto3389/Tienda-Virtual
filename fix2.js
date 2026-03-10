const fs = require('fs');

const editor = fs.readFileSync('src/pages/Admin/Legal/PrivacyEditor.jsx', 'utf8');
const editorMatch = editor.match(/return `([\s\S]+?)`;/);
const editorHtml = editorMatch ? editorMatch[0] : '';

let modal = fs.readFileSync('src/pages/Modals/PrivacyModal.jsx', 'utf8');
modal = modal.replace(/return `<div class="relative z-10 space-y-12">[\s\S]+?`;/, editorHtml);

const processStr = "\n  const processDocumentContent = (h) => { if(!h)return ''; return h.replace(/bg-white\\/80/g, 'bg-white/80 dark:bg-slate-800/80').replace(/bg-white\\/60/g, 'bg-white/60 dark:bg-slate-800/60').replace(/border-gray-200\\/40/g, 'border-gray-200/40 dark:border-slate-700/40').replace(/bg-([a-z]+)-50(?!0)/g, 'bg-$1-50 dark:bg-$1-900/40').replace(/bg-([a-z]+)-100(?!0)/g, 'bg-$1-100 dark:bg-$1-900/60').replace(/border-([a-z]+)-200/g, 'border-$1-200 dark:border-$1-800').replace(/text-gray-600/g, 'text-gray-600 dark:text-gray-300').replace(/text-[a-z]+-600/g, (m) => m + ' dark:' + m.replace('600','400')).replace(/text-[a-z]+-700/g, (m) => m + ' dark:' + m.replace('700','300')); };\n";

if (!modal.includes('processDocumentContent')) {
  modal = modal.replace('export const PrivacyModal = ({ onClose, darkMode }) => {', 'export const PrivacyModal = ({ onClose, darkMode }) => {' + processStr);
  modal = modal.replace('dangerouslySetInnerHTML={{ __html: content }}', 'dangerouslySetInnerHTML={{ __html: processDocumentContent(content) }}');
}
fs.writeFileSync('src/pages/Modals/PrivacyModal.jsx', modal);

let terms = fs.readFileSync('src/pages/Modals/TermsModal.jsx', 'utf8');
if (!terms.includes('processDocumentContent')) {
  terms = terms.replace('export const TermsModal = ({ onClose, darkMode }) => {', 'export const TermsModal = ({ onClose, darkMode }) => {' + processStr);
  terms = terms.replace('dangerouslySetInnerHTML={{ __html: content }}', 'dangerouslySetInnerHTML={{ __html: processDocumentContent(content) }}');
}
fs.writeFileSync('src/pages/Modals/TermsModal.jsx', terms);
console.log('SUCCESS');
