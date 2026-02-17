import fs from 'fs';
import path from 'path';

const pages = [
    'src/pages/citizen/CitizenDashboard.tsx',
    'src/pages/citizen/InteractiveMap.tsx',
    'src/pages/citizen/LiveTracking.tsx',
    'src/pages/citizen/Marketplace.tsx',
    'src/pages/citizen/ComplaintFeedback.tsx',
    'src/pages/citizen/AIWasteSegregation.tsx',
    'src/pages/citizen/Notifications.tsx',
    'src/pages/citizen/Profile.tsx',
    'src/pages/collector/CollectorDashboard.tsx',
    'src/pages/collector/CollectorMapRoute.tsx',
    'src/pages/collector/CollectorPickupVerification.tsx',
    'src/pages/collector/CollectorPerformance.tsx',
    'src/pages/admin/AdminDashboard.tsx',
    'src/pages/admin/AdminUserManagement.tsx',
    'src/pages/admin/AdminMarketplaceManagement.tsx',
    'src/pages/admin/AdminAnnouncements.tsx',
    'src/pages/admin/AdminFeedbackManagement.tsx',
    'src/pages/admin/AdminAIInsights.tsx',
    'src/pages/admin/AdminLeaderboard.tsx',
    'src/pages/admin/AdminSystemSettings.tsx',
];

const template = (name) => `
import React from 'react';

const ${name} = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${name.replace(/([A-Z])/g, ' $1').trim()}</h1>
      <p className="text-muted-foreground">This component is under construction.</p>
    </div>
  );
};

export default ${name};
`;

pages.forEach(filePath => {
    const fullPath = path.resolve(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    const name = path.basename(filePath, '.tsx');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, template(name));
        console.log("Created " + filePath);
    } else {
        console.log("Skipped " + filePath + " (exists)");
    }
});
