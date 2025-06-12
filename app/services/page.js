import styles from "./ServicesPage.module.css";
import Link from "next/link";

export const metadata = {
  title: "Services | Website Builders America",
  description:
    "Full-stack software engineering services offered by a professional developer.",
};

export default function ServicesPage() {
  return (
    <section className={styles.section}>
      <div className={styles.headingContainer}>
        <span className={styles.subtitle}>Our Services</span>

        <h2 className={styles.heading}>Full-Stack Software Engineering</h2>

        <p className={styles.paragraph}>
          From concept to deployment, I offer complete software development
          services — frontend, backend, databases, and cloud.
        </p>
      </div>

      <div className={styles.details}>
        <div className={styles.service}>
          <h3>
            <span className={styles.icon}>🌐</span> Frontend Development
          </h3>
          <p>
            I build fast, responsive, and visually engaging user interfaces
            using modern frameworks like React and Next.js.
          </p>
          <ul>
            <li>Pixel-perfect custom designs</li>
            <li>Responsive layout for all screen sizes</li>
            <li>SEO-friendly HTML structure and metadata</li>
            <li>Client-side routing and state management</li>
          </ul>
        </div>

        <div className={styles.service}>
          <h3>
            <span className={styles.icon}>🧠</span> Backend & APIs
          </h3>
          <p>
            Powerful server-side logic to drive your app — with secure
            authentication, robust APIs, and optimized databases.
          </p>
          <ul>
            <li>Node.js + Express.js REST APIs</li>
            <li>GraphQL endpoints</li>
            <li>MongoDB, PostgreSQL, or MySQL schemas</li>
            <li>Authentication and authorization systems</li>
          </ul>
        </div>

        <div className={styles.service}>
          <h3>
            <span className={styles.icon}>☁️</span> Cloud & DevOps
          </h3>
          <p>
            I handle deployments, serverless architecture, CI/CD pipelines, and
            everything needed to ship fast and scale safely.
          </p>
          <ul>
            <li>Deployments via Vercel, AWS, and DigitalOcean</li>
            <li>GitHub Actions / CI pipeline setup</li>
            <li>Environment variable management</li>
            <li>Serverless functions & edge routing</li>
          </ul>
        </div>

        <div className={styles.service}>
          <h3>
            <span className={styles.icon}>🛒</span> E-commerce Solutions
          </h3>
          <p>
            Complete custom online stores — from product pages to checkout,
            admin dashboards, and payment integrations.
          </p>
          <ul>
            <li>Stripe, PayPal, and other gateways</li>
            <li>Cart, checkout, and order flow</li>
            <li>Inventory and product dashboard</li>
            <li>Secure customer accounts and login</li>
          </ul>
        </div>

        <div className={styles.service}>
          <h3>
            <span className={styles.icon}>🔧</span> Maintenance & Optimization
          </h3>
          <p>
            Keep your site healthy, fast, and up to date with continuous
            improvements and technical tuning.
          </p>
          <ul>
            <li>Performance and load time tuning</li>
            <li>Bug fixes and issue resolution</li>
            <li>Accessibility improvements</li>
            <li>SEO enhancements and rich snippet setup</li>
          </ul>
        </div>

        <div className={styles.service}>
          <h3>
            <span className={styles.icon}>🧩</span> Custom Tools & Automation
          </h3>
          <p>
            Let’s build something tailored — internal dashboards, CRON jobs, AI
            integrations, or no-code API bridges.
          </p>
          <ul>
            <li>Custom CMS systems or admin panels</li>
            <li>OpenAI, Google Calendar, Maps API integrations</li>
            <li>Zapier workflows, webhook listeners</li>
            <li>Scheduled tasks and CRON automation</li>
          </ul>
        </div>
      </div>

      <div className={styles.cta}>
        <h3>🚀 Ready to build?</h3>
        <p>
          Let us collaborate on your next project. We will handle the code — you
          focus on the vision.
        </p>
      </div>
    </section>
  );
}
