-- ============================================================
--  Alini Solutions — MySQL / MariaDB Schema
--  Run: mysql -u alini_user -p alini_web < sql/schema.sql
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+03:00';

-- ── Admin users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100) NOT NULL,
  role          ENUM('super_admin','editor') NOT NULL DEFAULT 'editor',
  last_login    DATETIME,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Pricing tabs ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_tabs (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tab_id     VARCHAR(50)  NOT NULL UNIQUE,
  label      VARCHAR(100) NOT NULL,
  icon       VARCHAR(10)  NOT NULL,
  highlight  TINYINT(1)   NOT NULL DEFAULT 0,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Pricing plans ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_plans (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tab_id      VARCHAR(50)  NOT NULL,
  badge       VARCHAR(50),
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  price       VARCHAR(30)  NOT NULL,
  period      VARCHAR(30),
  is_featured TINYINT(1)   NOT NULL DEFAULT 0,
  cta_label   VARCHAR(50)  NOT NULL DEFAULT 'Get Started',
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tab_id (tab_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Plan features ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_features (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id     INT UNSIGNED NOT NULL,
  feature     VARCHAR(255) NOT NULL,
  is_included TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (plan_id) REFERENCES pricing_plans(id) ON DELETE CASCADE,
  INDEX idx_plan_id (plan_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Domain pricing rows ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_domains (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  extension     VARCHAR(50)  NOT NULL,
  badge         VARCHAR(30),
  registration  VARCHAR(50)  NOT NULL,
  renewal       VARCHAR(50)  NOT NULL,
  includes_text VARCHAR(200) NOT NULL,
  is_featured   TINYINT(1)   NOT NULL DEFAULT 0,
  cta_label     VARCHAR(30)  NOT NULL DEFAULT 'Register',
  sort_order    INT UNSIGNED NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Bundles ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pricing_bundles (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  icon        VARCHAR(10)  NOT NULL,
  name        VARCHAR(100) NOT NULL,
  tagline     VARCHAR(150),
  price       VARCHAR(30)  NOT NULL,
  period      VARCHAR(30),
  saving      VARCHAR(100),
  best_for    VARCHAR(200),
  color       ENUM('red','orange','green') NOT NULL DEFAULT 'red',
  is_featured TINYINT(1)   NOT NULL DEFAULT 0,
  cta_label   VARCHAR(50)  NOT NULL DEFAULT 'Get This Bundle',
  sort_order  INT UNSIGNED NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bundle_features (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  bundle_id  INT UNSIGNED NOT NULL,
  feature    VARCHAR(255) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (bundle_id) REFERENCES pricing_bundles(id) ON DELETE CASCADE,
  INDEX idx_bundle_id (bundle_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Contact leads ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  company    VARCHAR(150),
  service    VARCHAR(100),
  message    TEXT NOT NULL,
  ip_address VARCHAR(45),
  status     ENUM('new','contacted','qualified','closed','spam') NOT NULL DEFAULT 'new',
  notes      TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Site content ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`      VARCHAR(100) NOT NULL UNIQUE,
  value      TEXT NOT NULL,
  label      VARCHAR(150),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
--  SEED DATA  (explicit IDs — no LAST_INSERT_ID arithmetic)
-- ============================================================

-- Admin (password: Admin@Alini2024 — CHANGE IMMEDIATELY)
INSERT IGNORE INTO admin_users (email, password_hash, name, role) VALUES
('admin@alinisolution.co.ke',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2oW4yK5HJi',
 'Alini Admin', 'super_admin');

-- Pricing tabs
INSERT IGNORE INTO pricing_tabs (tab_id, label, icon, highlight, sort_order) VALUES
('hosting', '🌐 Web Hosting',   '🌐', 0, 1),
('email',   '📧 Email Hosting', '📧', 0, 2),
('storage', '🗄️ File Storage',  '🗄️', 0, 3),
('domains', '🔗 Domains',       '🔗', 0, 4),
('managed', '⚙️ Managed Infra', '⚙️', 0, 5),
('bundle',  '🔥 Bundles',       '🔥', 1, 6);

-- Hosting plans (explicit IDs 1-3)
INSERT IGNORE INTO pricing_plans (id, tab_id, badge, name, description, price, period, is_featured, sort_order) VALUES
(1, 'hosting', 'Starter',      'Starter Host',  'Perfect for personal sites, portfolios, and small business landing pages.', '800',    '/mo', 0, 1),
(2, 'hosting', 'Most Popular', 'Business Host', 'For growing businesses, e-commerce, and high-traffic applications.',        '3,500',  '/mo', 1, 2),
(3, 'hosting', 'Premium',      'Pro / VPS Host','Dedicated resources, full root access, and enterprise-grade performance.', '12,000', '/mo', 0, 3);

INSERT IGNORE INTO pricing_features (plan_id, feature, is_included, sort_order) VALUES
(1,'1 website',1,1),(1,'5 GB SSD storage',1,2),(1,'Free SSL certificate',1,3),
(1,'99.9% uptime SLA',1,4),(1,'cPanel / control panel',1,5),(1,'Email support',1,6),
(1,'Staging environment',0,7),(1,'CDN included',0,8),
(2,'Up to 5 websites',1,1),(2,'50 GB NVMe SSD storage',1,2),(2,'Free SSL + Cloudflare CDN',1,3),
(2,'Daily automated backups',1,4),(2,'Staging environment',1,5),(2,'Priority support',1,6),
(2,'1-click app installs',1,7),(2,'Dedicated resources',0,8),
(3,'Unlimited websites',1,1),(3,'200 GB NVMe SSD',1,2),(3,'Dedicated vCPU & RAM',1,3),
(3,'Full root / SSH access',1,4),(3,'DDoS protection',1,5),(3,'Managed server updates',1,6),
(3,'24/7 phone + chat support',1,7),(3,'Custom server config',1,8);

-- Email plans (explicit IDs 4-6)
INSERT IGNORE INTO pricing_plans (id, tab_id, badge, name, description, price, period, is_featured, sort_order) VALUES
(4,'email','Small Teams', 'Mail Essentials','Professional branded email for small teams and sole traders.',      '500',   '/user/mo',0,1),
(5,'email','Most Popular','Business Mail',  'Google Workspace or M365 setup included.',                         '1,200', '/user/mo',1,2),
(6,'email','Enterprise',  'Enterprise Mail','Compliance-ready high-volume mail infrastructure for large orgs.', 'Custom','',        0,3);

INSERT IGNORE INTO pricing_features (plan_id, feature, is_included, sort_order) VALUES
(4,'Custom domain email (you@yourbiz.co.ke)',1,1),(4,'10 GB mailbox per user',1,2),
(4,'Webmail + mobile sync',1,3),(4,'Spam & virus filtering',1,4),(4,'Up to 10 users',1,5),
(4,'Shared calendars',0,6),(4,'Video conferencing',0,7),
(5,'Custom domain email',1,1),(5,'50 GB mailbox per user',1,2),(5,'Google Workspace or M365 setup',1,3),
(5,'Shared calendars & contacts',1,4),(5,'Meet / Teams video conferencing',1,5),
(5,'Advanced spam & phishing protection',1,6),(5,'Migration from existing mail',1,7),(5,'Priority support',1,8),
(6,'Unlimited users',1,1),(6,'Unlimited mailbox storage',1,2),(6,'Self-hosted or hybrid mail server',1,3),
(6,'DKIM / DMARC / SPF hardening',1,4),(6,'Email archiving & eDiscovery',1,5),
(6,'SLA-backed uptime',1,6),(6,'Dedicated mail admin support',1,7),(6,'Data residency (KE region)',1,8);

-- Storage plans (explicit IDs 7-9)
INSERT IGNORE INTO pricing_plans (id, tab_id, badge, name, description, price, period, is_featured, sort_order) VALUES
(7,'storage','Personal',    'Cloud Store S', 'Secure cloud file storage for individuals and small teams.','700',  '/mo',0,1),
(8,'storage','Most Popular','Cloud Store M', 'Team-ready with versioning, audit logs, and admin controls.','2,800','/mo',1,2),
(9,'storage','Enterprise',  'Cloud Store XL','S3-compatible object storage at scale.',                    '8,500','/mo',0,3);

INSERT IGNORE INTO pricing_features (plan_id, feature, is_included, sort_order) VALUES
(7,'100 GB storage',1,1),(7,'File sync across devices',1,2),(7,'Share links with expiry',1,3),
(7,'Basic access controls',1,4),(7,'Web + mobile access',1,5),(7,'Team folders',0,6),(7,'API access',0,7),
(8,'1 TB storage',1,1),(8,'Team folders & shared drives',1,2),(8,'File versioning (90 days)',1,3),
(8,'Granular access permissions',1,4),(8,'Audit log & activity feed',1,5),
(8,'API access for integrations',1,6),(8,'Up to 25 users',1,7),(8,'Unlimited users',0,8),
(9,'10 TB+ storage (scalable)',1,1),(9,'S3-compatible object storage',1,2),(9,'Unlimited users',1,3),
(9,'Automated backups + snapshots',1,4),(9,'Geo-redundant replication',1,5),
(9,'Custom retention policies',1,6),(9,'Dedicated support engineer',1,7),(9,'Data residency (KE region)',1,8);

-- Managed infra plans (explicit IDs 10-12)
INSERT IGNORE INTO pricing_plans (id, tab_id, badge, name, description, price, period, is_featured, sort_order) VALUES
(10,'managed','Startup',     'Foundation',  'Managed infra for startups getting serious about uptime.',      '25,000','/mo',0,1),
(11,'managed','Most Popular','Professional','Full DevOps coverage for companies that cannot afford downtime.','75,000','/mo',1,2),
(12,'managed','Enterprise',  'Enterprise',  'A fully embedded engineering team for mission-critical envs.',  'Custom','',  0,3);

INSERT IGNORE INTO pricing_features (plan_id, feature, is_included, sort_order) VALUES
(10,'Up to 3 servers managed',1,1),(10,'24/7 uptime monitoring',1,2),(10,'Monthly security patching',1,3),
(10,'Basic CI/CD pipeline',1,4),(10,'Weekly backup verification',1,5),(10,'Email support (8h SLA)',1,6),
(10,'Dedicated architect',0,7),(10,'On-call engineer',0,8),
(11,'Up to 15 servers managed',1,1),(11,'24/7 monitoring + on-call',1,2),(11,'Full automation & CI/CD',1,3),
(11,'Quarterly architecture review',1,4),(11,'Dedicated engineer',1,5),(11,'Solution architecture consults',1,6),
(11,'Chat & phone support (2h SLA)',1,7),(11,'AI/ML integration',0,8),
(12,'Unlimited servers',1,1),(12,'Dedicated SRE team',1,2),(12,'Full DevOps & platform eng.',1,3),
(12,'AI / ML integration & MLOps',1,4),(12,'Compliance (ISO 27001, SOC 2)',1,5),
(12,'Custom SLAs & contracts',1,6),(12,'Executive infra reporting',1,7),(12,'On-site visits (Nairobi)',1,8);

-- Domain rows
INSERT IGNORE INTO pricing_domains (extension, badge, registration, renewal, includes_text, is_featured, cta_label, sort_order) VALUES
('.co.ke',         NULL,      'KES 1,500/yr','KES 1,500/yr','DNS setup + SSL',                   0,'Register',1),
('.ke',            NULL,      'KES 2,000/yr','KES 2,000/yr','DNS setup + SSL',                   0,'Register',2),
('.com',           'Popular', 'KES 1,800/yr','KES 1,800/yr','DNS setup + SSL + email forwarding',1,'Register',3),
('.org / .net',    NULL,      'KES 2,200/yr','KES 2,200/yr','DNS setup + SSL',                   0,'Register',4),
('.africa / .io',  NULL,      'KES 4,500/yr','KES 4,500/yr','DNS setup + SSL',                   0,'Register',5),
('Domain Transfer',NULL,      'KES 800',     '-',            'Full DNS migration + SSL reissue',  0,'Transfer',6),
('DNS Management', NULL,      'KES 500/mo',  'Ongoing',      'Custom records, subdomains, monitoring',0,'Enquire',7);

-- Bundles (explicit IDs 1-3)
INSERT IGNORE INTO pricing_bundles (id, icon, name, tagline, price, period, saving, best_for, color, is_featured, sort_order) VALUES
(1,'🚀','Launch Pack',  'Get online fast',           '4,500', '/mo','Save ~30% vs individual',               'New businesses, freelancers, personal brands','red',   0,1),
(2,'🏢','Business Pack','The complete office stack',  '12,000','/mo','Save ~35% vs individual - Most Popular','SMEs, growing teams, e-commerce',            'orange',1,2),
(3,'⚡','Scale Pack',   'Infrastructure + everything','90,000','/mo','Save ~40% vs individual - Full-stack',  'Scale-ups, tech companies, enterprises',      'green', 0,3);

INSERT IGNORE INTO bundle_features (bundle_id, feature, sort_order) VALUES
(1,'.co.ke or .com domain (1 yr)',1),(1,'Starter web hosting (5 GB)',2),(1,'5 professional email accounts',3),
(1,'Free SSL certificate',4),(1,'DNS setup & management',5),(1,'1-time website migration',6),
(2,'Premium .com + .co.ke domains',1),(2,'Business hosting (50 GB NVMe)',2),(2,'Google Workspace / M365 (10 users)',3),
(2,'1 TB team file storage',4),(2,'Daily backups',5),(2,'CDN + advanced SSL',6),(2,'Priority support (chat + phone)',7),
(3,'All Business Pack features',1),(3,'Managed VPS / cloud servers (10)',2),(3,'Full DevOps & CI/CD automation',3),
(3,'10 TB file storage',4),(3,'Unlimited email users',5),(3,'24/7 monitoring + on-call SLA',6),
(3,'Quarterly architecture review',7),(3,'Dedicated engineer',8);

-- Site content
INSERT IGNORE INTO site_content (`key`, value, label) VALUES
('hero_tag',        'Nairobi - East Africa - Global',    'Hero - Location tag'),
('hero_headline',   'Infrastructure that scales with ambition','Hero - Main headline'),
('hero_sub',        'Alini Solutions delivers enterprise-grade managed cloud infrastructure, automation, and AI-powered systems.','Hero - Subheadline'),
('stat_uptime',     '99.9%','Stat - Uptime SLA'),
('stat_support',    '24/7', 'Stat - Support hours'),
('stat_clients',    '60+',  'Stat - Clients served'),
('pricing_vat_note','All prices exclude VAT. Custom quotes available for any combination of services.','Pricing - VAT disclaimer');