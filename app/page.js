// app/page.js
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import CheckoutButton from "./components/CheckoutButton";
import ContactForm from "./components/ContactForm";

export default function Home() {
  useEffect(() => {
    const links = document.querySelectorAll(".accordion__sidebar a");
    const sidebar = document.querySelector(".accordion__sidebar");
    const backdrop = document.querySelector(".accordion__backdrop");

    links.forEach((link) =>
      link.addEventListener("click", () => {
        sidebar.classList.remove("accordion__sidebar--open");
        backdrop.classList.remove("accordion__backdrop--visible");
      })
    );

    // Clean up the event listeners on unmount
    return () => {
      links.forEach((link) =>
        link.removeEventListener("click", () => {
          sidebar.classList.remove("accordion__sidebar--open");
          backdrop.classList.remove("accordion__backdrop--visible");
        })
      );
    };
  }, []);

  return (
    <>
      <main className="container">
        <header className="header">
          <div className="logo logo--header">
            <Link href="/" className="logo__link">
              <Image
                src="/img/favicontransparent.png"
                alt="Website Builders America logo"
                width={140}
                height={140}
                className="logo__photo"
              />
            </Link>
          </div>
          <div className="accordion">
            <button
              className="accordion__toggle"
              onClick={() => {
                const menu = document.querySelector(".accordion__sidebar");
                const backdrop = document.querySelector(".accordion__backdrop");
                menu.classList.toggle("accordion__sidebar--open");
                backdrop.classList.toggle("accordion__backdrop--visible");
              }}
            >
              ☰ Menu
            </button>

            <nav className="accordion__sidebar">
              <ul className="accordion__links">
                <li>
                  <a href="#section-features">Features</a>
                </li>
                <li>
                  <a href="#section-portfolio">Portfolio</a>
                </li>
                <li>
                  <a href="#section-reviews">Reviews</a>
                </li>
                <li>
                  <a href="#section-process">Process</a>
                </li>
                <li>
                  <a href="#section-pricing">Pricing</a>
                </li>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <Link href="/blog/" legacyBehavior>
                    <a>Go to Blog</a>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* ⬇️ Place this after the closing </nav> */}
            <div
              className="accordion__backdrop"
              onClick={() => {
                document
                  .querySelector(".accordion__sidebar")
                  .classList.remove("accordion__sidebar--open");
                document
                  .querySelector(".accordion__backdrop")
                  .classList.remove("accordion__backdrop--visible");
              }}
            ></div>
          </div>

          <div className="header__text-box u-center-text">
            <div className="heading-container">
              <span className="heading-4 subtitle">Website developers</span>
              <h1 className="heading-1 u-margin-bottom-exsmall">
                We Build Websites
              </h1>
            </div>
            <p className="header__text u-margin-bottom-large">
              Everything you need for your perfect website in all small
              businesses
            </p>

            <a href="tel:6197802862" className="btn-link">
              <button className="btn">Schedule a Phone Call Now</button>
            </a>

            <div className="user-box">
              <Image
                src="/img/user1.jpg"
                alt="User1"
                width={42}
                height={42}
                className="user-box__photo"
              />
              <p className="user-box__text">
                &ldquo;The website came out perfectly! They were very helpful
                throughout the entire process.&rdquo;
              </p>
            </div>
            <div>
              <a
                href="#section-reviews"
                className="btn-text u-margin-top-exsmall"
              >
                Read more &rarr;
              </a>
            </div>
          </div>
        </header>

        <section className="section-features" id="section-features">
          <div className="heading-container">
            <span className="heading-4 subtitle">Top features</span>

            <h2 className="heading-2 u-margin-bottom-exsmall">
              Say Goodbye to All Your Website Hassles
            </h2>

            <p className="paragraph-medium u-margin-bottom-xl">
              No more spending days creating a website by yourself. Let
              professionals do the work for you.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-box__features">
              <h3 className="heading-3">
                <span className="icon">
                  <i className="feature-box__icon ph-thumbs-up-thin"></i>
                </span>
                Easy
              </h3>
              <p className="feature-box__text">
                What are the goals of your website? Tell us everything you need
                on your site, and we got the rest!
              </p>
            </div>

            <div className="feature-box__features">
              <h3 className="heading-3">
                <span className="icon">
                  <i className="feature-box__icon ph-clock-thin"></i>
                </span>
                Fast
              </h3>
              <p className="feature-box__text">
                A turnaround until your first draft is created is about a few
                days or less &ndash; faster than ever!
              </p>
            </div>

            <div className="feature-box__features">
              <h3 className="heading-3">
                <span className="icon">
                  <i className="feature-box__icon ph-shield-check-thin"></i>
                </span>
                Secure
              </h3>
              <p className="feature-box__text">
                <b>No deposits, no hidden fees</b>. You do not get charged
                anything until you receive your website!
              </p>
            </div>
          </div>
        </section>

        <section className="section-portfolio" id="section-portfolio">
          <div className="heading-container heading-container__portfolio">
            <a
              href="/portfolio"
              className="heading-4 subtitle u-margin-bottom-large"
            >
              View Full Portfolio →
            </a>
          </div>

          <div className="portfolio-center">
            <div className="portfolio">
              {[
                { href: "https://www.dandggardening.com/", src: "j.png" },
                {
                  href: "https://www.orlandosjunkremoval.com",
                  src: "orlandosjunkremoval.png",
                },
                {
                  href: "https://www.professionalcarpetcleaningsacramento.com/",
                  src: "h.png",
                },
                // {
                //   href: "https://san-deigo-junk-removal.vercel.app/",
                //   src: "i.png",
                // },
                { href: "https://lawn-services-llc.vercel.app/", src: "g.png" },
                { href: "https://www.alwaysdiamondlimo.com/", src: "d.png" },
                // { href: "https://www.jsremixedbyj.com/", src: "a.png" },
                { href: "https://www.khaosparrish.com/", src: "b.png" },
                { href: "https://www.vanityhabit.com/", src: "c.png" },
                { href: "https://calihouseinc.com/", src: "e.png" },
                { href: "https://www.ourmusicevents.com/", src: "f.png" },
              ].map(({ href, src }, i) => (
                <figure key={i} className="portfolio__container">
                  <a href={href} target="_blank" rel="noopener">
                    <Image
                      src={`/img/${src}`}
                      alt={`Website preview ${i + 1}`}
                      width={600}
                      height={400}
                      className="portfolio__photo"
                    />
                  </a>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section-reviews" id="section-reviews">
          <div className="heading-container heading-container__reviews">
            <span className="heading-4 subtitle">Reviews</span>
            <h2 className="heading-2 u-margin-bottom-large">
              Reviews from Happy Clients
            </h2>
          </div>

          <div className="review-box">
            <figure className="review-box__content">
              <div className="review-box__icon-box">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="review-box__icon-star ph-star-fill"></i>
                ))}
              </div>
              <blockquote className="review-box__text u-margin-bottom-exsmall">
                <h2 className="heading-2-review u-margin-bottom-small">
                  We highly recommend Website Builders America!
                </h2>
                <p className="review-box__clientreview">
                  Anton with Website Builders America did an awesome job on the
                  website for our small business! He turned our outdated
                  ineffective website into a modern, simple to use and highly
                  effective one!
                </p>
              </blockquote>
              <p className="review-box__name">
                <i className="ph-user-fill"></i> George P.
              </p>
              <p className="review-box__company">
                <i className="ph-buildings-fill"></i> Owner of D&G Gardening
              </p>
              <div>
                <a
                  href="https://www.dandggardening.com/"
                  className="btn-text"
                  target="_blank"
                >
                  Visit website &rarr;
                </a>
              </div>
            </figure>
          </div>
          <div className="review-box__read">
            <a href="/reviews" className="btn-text" target="_blank">
              Read more &rarr;
            </a>
          </div>
        </section>

        <section className="section-process" id="section-process">
          <div className="heading-container">
            <span className="heading-4 subtitle">How it works</span>
            <h2 className="heading-2 u-margin-bottom-large">
              Simplified Process
            </h2>
          </div>

          <div className="process-center">
            <div className="process">
              {[
                ["one", "Discuss", "Talk on the phone about the details"],
                ["two", "Develop", "Design and build a draft of your website"],
                ["three", "Edit", "Make changes to the draft if necessary"],
                ["four", "Launch", "Publish your website on the internet"],
                ["five", "Pay", "Pay online within 24 hours of publication"],
              ].map(([icon, title, text], i) => (
                <div key={i} className="process__box">
                  <span className="icon">
                    <i className={`process__icon ph-number-${icon}-thin`}></i>
                  </span>
                  <h3 className="heading-3">{title}</h3>
                  <p className="process__text">
                    <span className="process__ndash">&ndash;</span> {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pricing" id="section-pricing">
          <div className="heading-container heading-container__pricing">
            <span className="heading-4 subtitle">Pricing</span>
            <h2 className="heading-2 u-margin-bottom-large">
              Limited Time Offer Just For You
            </h2>
          </div>

          <div className="pricing">
            <div className="pricing__website">
              <span className="heading-4 subtitle subtitle--icon">
                <i className="ph-number-circle-one-thin"></i> Complete package
              </span>
              <span className="pricing__normal">
                <em></em>
              </span>
              <p className="pricing__description">
                <i className="ph-caret-double-right-thin"></i> Includes{" "}
                <b>EVERYTHING:</b>
              </p>
              <ul className="pricing__list">
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Sleek design
                </li>
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Great content
                </li>
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Domain fee
                </li>
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Hosting fee
                </li>
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Google listing
                </li>
              </ul>
              <p className="pricing__save">
                <i className="ph-heart-fill"></i>
                <b>BEST VALUE EVER!</b>
              </p>
            </div>

            <div className="pricing__maintenance">
              <span className="heading-4 subtitle subtitle--icon">
                <i className="ph-number-circle-two-thin"></i> Maintenance
              </span>
              <span className="pricing__normal">
                <em></em>
              </span>
              <p className="pricing__description">
                <i className="ph-caret-double-right-thin"></i> To renew your
                domain:
              </p>
              <ul className="pricing__list">
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Yearly fee
                </li>
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Hosting management
                </li>
                <li className="pricing__item">
                  <i className="ph-check-light"></i> Easy pay with an app
                </li>
              </ul>
              <p className="pricing__save">
                <i className="ph-heart-fill"></i>
                <b>NO MONTHLY FEES!</b>
              </p>
              <CheckoutButton
                amount={14900}
                label="Buy Now for $149"
                style={{ marginTop: "4rem" }}
              />
            </div>
          </div>

          <a href="tel:6197802862" className="btn-link">
            <button className="btn">Schedule a Phone Call Now</button>
          </a>
        </section>
      </main>
      <section className="about__section" id="about">
        <div className="about__image">
          <figure className="about__cell">
            <img
              src="/img/aboutus-min.jpeg"
              className="about__profile"
              alt="Anton and Mana"
            />
          </figure>
        </div>

        <div className="about__text">
          <div className="about__box">
            <span className="heading-4 subtitle">About us</span>
            <h2 className="heading-2 u-margin-bottom-medium">
              Website Development Professionals
            </h2>
            <p>
              We are Anton & Mana &ndash; website designers and developers from
              San Diego, California, specializing in small businesses in all
              sectors.
              <br />
              <br />
              We do our best to help and guide you through to the best result
              possible &ndash; your perfect website you will be truly happy
              with.
              <br />
              <br />
              Let us take your business to the next level with your beautiful
              website!
            </p>
          </div>
        </div>
      </section>
      <ContactForm></ContactForm>
      <footer className="footer">
        <div className="footer__main">
          <div className="logo logo--footer">
            <Link href="/" className="logo__link">
              <img
                src="/img/favicontransparent.png"
                alt="Website Builders America logo"
                className="logo__photo"
              />
            </Link>
          </div>

          <div className="footer__contact">
            <div className="footer__phone">
              <p className="footer__heading">Phone</p>
              <p className="footer__light">(619) 780-2862</p>
            </div>
            <div className="Email">
              <p className="footer__heading">Email</p>
              <p className="footer__light">WebsiteBuildersAmerica@gmail.com</p>
            </div>
          </div>

          <div className="footer__other">
            <div className="footer__location">
              <p className="footer__heading">Location</p>
              <p className="footer__light">San Diego, CA</p>
            </div>

            <div className="footer__instagram">
              <p className="footer__heading">Social Media</p>
              <a
                href="https://www.instagram.com/websitebuildersamerica/"
                target="_blank"
                className="footer__icon"
              >
                <i className="footer__icon ph-instagram-logo-light"></i>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100068177806553"
                target="_blank"
                className="footer__icon"
              >
                <i className="footer__icon ph-facebook-logo-light"></i>
              </a>
              <a
                href="https://twitter.com/WebBuilders_USA"
                target="_blank"
                className="footer__icon"
              >
                <i className="footer__icon ph-twitter-logo-light"></i>
              </a>
              <a
                href="https://www.youtube.com/channel/UCbbxDSu_a3Fy5t5sOMj2ONQ"
                target="_blank"
                className="footer__icon"
              >
                <i className="footer__icon ph-youtube-logo-light"></i>
              </a>
            </div>
          </div>
        </div>

        <p className="footer__copyright">
          Copyright &copy; 2023 by Website Builders America. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}
