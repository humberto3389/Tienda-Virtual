const fs = require('fs');
const path = require('path');

const processHtmlStr = `
  const processDocumentContent = (html) => {
    if (!html) return '';
    return html
      .replace(/bg-white\\/80/g, 'bg-white/80 dark:bg-slate-800/80')
      .replace(/bg-white\\/60/g, 'bg-white/60 dark:bg-slate-800/60')
      .replace(/border-gray-200\\/40/g, 'border-gray-200/40 dark:border-slate-700/40')
      .replace(/bg-([a-z]+)-50(?!0)/g, 'bg-$1-50 dark:bg-$1-900/20')
      .replace(/bg-([a-z]+)-100(?!0)/g, 'bg-$1-100 dark:bg-$1-900/40')
      .replace(/border-([a-z]+)-200/g, 'border-$1-200 dark:border-$1-800/50')
      .replace(/text-gray-600/g, 'text-gray-600 dark:text-gray-300')
      .replace(/text-gray-800/g, 'text-gray-800 dark:text-gray-100')
      .replace(/text-([a-z]+)-600/g, 'text-$1-600 dark:text-$1-400')
      .replace(/text-([a-z]+)-700/g, 'text-$1-700 dark:text-$1-300');
  };
`;

try {
  const privacyEditorFile = path.join(__dirname, 'src/pages/Admin/Legal/PrivacyEditor.jsx');
  const privacyCode = fs.readFileSync(privacyEditorFile, 'utf8');
  
  // Extract exact HTML
  const match = privacyCode.match(/return \`([\\s\\S]+?)\`;\\n  };\\n\\n  const handleSave/);
  if (!match) throw new Error('Could not find static content in PrivacyEditor');
  const staticPrivacyHtml = match[1];

  const privacyFile = path.join(__dirname, 'src/pages/Modals/PrivacyModal.jsx');
  let privacyModalCode = fs.readFileSync(privacyFile, 'utf8');

  // Replace old static function with the standardized PrivacyEditor HTML
  privacyModalCode = privacyModalCode.replace(/const getStaticPrivacyContent = \\(\\) => {\\n\\s*return \\`[\\s\\S]+?\\`;\\n  };/, \`const getStaticPrivacyContent = () => {\\n    return \\\`\${staticPrivacyHtml}\\\`;\\n  };\`);

  if (!privacyModalCode.includes('processDocumentContent')) {
    privacyModalCode = privacyModalCode.replace('export const PrivacyModal = ({ onClose, darkMode }) => {', 'export const PrivacyModal = ({ onClose, darkMode }) => {' + processHtmlStr);
    privacyModalCode = privacyModalCode.replace('dangerouslySetInnerHTML={{ __html: content }}', 'dangerouslySetInnerHTML={{ __html: processDocumentContent(content) }}');
  }
  fs.writeFileSync(privacyFile, privacyModalCode);

  const termsFile = path.join(__dirname, 'src/pages/Modals/TermsModal.jsx');
  let termsCode = fs.readFileSync(termsFile, 'utf8');

  if (!termsCode.includes('processDocumentContent')) {
    termsCode = termsCode.replace('export const TermsModal = ({ onClose, darkMode }) => {', 'export const TermsModal = ({ onClose, darkMode }) => {' + processHtmlStr);
    termsCode = termsCode.replace('dangerouslySetInnerHTML={{ __html: content }}', 'dangerouslySetInnerHTML={{ __html: processDocumentContent(content) }}');
    fs.writeFileSync(termsFile, termsCode);
  }

  console.log('SUCCESS');
} catch (e) {
  console.error(e);
}
