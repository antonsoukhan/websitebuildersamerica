import Link from "next/link";
export const metadata = {
  title: "Client Reviews | Website Builders America",
  description: "Read what our happy clients have to say about working with us.",
};
// made changes
const reviews = [
  {
    stars: 5,
    headline:
      "Mana does not just build you a website – she is building your brand!",
    text: `Wow, Heaven Sent! She must have wings! Mana did an amazing job on my website!
        She is extremely knowledgeable and professional! She is incredibly fast and delivers quality work!
        Mana is gifted at what she does. She does not just build you a website – she is building your brand!
        Phenomenal job Mana and everybody loves my website! Thank You!`,
    name: "Mistee B.",
    company: "Owner of VanityHabit",
    website: "https://www.vanityhabit.com/",
  },
  {
    stars: 5,
    headline: "We highly recommend Website Builders America!",
    text: `Anton with Website Builders America did an awesome job on the website for our small business!
        He turned our outdated ineffective website into a modern, simple to use and highly effective one!
        From our initial interaction he understood exactly what we were looking for, delivered within a short period of time,
        and made the whole process from start to finish smooth. We highly recommend Website Builders America!`,
    name: "George P.",
    company: "Owner of D&G Gardening",
    website: "https://www.dandggardening.com/",
  },
  {
    stars: 5,
    headline: "They helped bring our vision to life!",
    text: `Working with Website Builders America was an incredible experience!
        They listened carefully, were easy to communicate with, and helped bring our vision to life.
        The site looks and works beautifully.`,
    name: "James R.",
    company: "Founder of Our Music Events",
    website: "https://www.ourmusicevents.com/",
  },
  {
    stars: 5,
    headline: "Quick turnaround and very professional",
    text: `Mana and Anton were amazing to work with. They built my business website quickly and professionally,
        with great attention to detail. I love how everything turned out and so do my customers.`,
    name: "Dee C.",
    company: "Massage by Dee",
    website: "https://www.alwaysdiamondlimo.com/",
  },
  {
    stars: 5,
    headline: "Reliable, creative, and extremely efficient",
    text: `I was referred to Website Builders America by a friend and I couldn’t be happier.
        They were reliable, creative, and extremely efficient. The entire process was smooth and I’ve already recommended them to others.`,
    name: "Jessica S.",
    company: "Remixed by J",
    website: "https://www.jsremixedbyj.com/",
  },
  {
    stars: 5,
    headline: "Affordable and professional",
    text: `Website Builders America was professional and very affordable. They walked me through every step,
        were patient with my questions, and delivered an amazing result.`,
    name: "Khaos P.",
    company: "Khaos Parrish",
    website: "https://www.khaosparrish.com/",
  },
];

export default function ReviewsPage() {
  return (
    <>
      <div className="container__reviews">
        <main className="section-reviews">
          <div className="heading-container heading-container__reviews">
            <span className="heading-4 subtitle">Reviews</span>
            <h2 className="heading-2 u-margin-bottom-large">
              Happy Clients Say It Best
            </h2>
          </div>

          {reviews.map((review, idx) => (
            <div className="review-box u-margin-bottom-large" key={idx}>
              <figure className="review-box__content">
                <div className="review-box__icon-box">
                  {[...Array(review.stars)].map((_, i) => (
                    <i
                      key={i}
                      className="review-box__icon-star ph-star-fill"
                    ></i>
                  ))}
                </div>

                <blockquote className="review-box__text u-margin-bottom-exsmall">
                  <h2 className="heading-2-review u-margin-bottom-small">
                    {review.headline}
                  </h2>
                  <p className="review-box__clientreview">{review.text}</p>
                </blockquote>

                <p className="review-box__name">
                  <i className="ph-user-fill" /> {review.name}
                </p>
                <p className="review-box__company">
                  <i className="ph-buildings-fill" /> {review.company}
                </p>
                <div>
                  <a
                    href={review.website}
                    className="btn-text"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website &rarr;
                  </a>
                </div>
              </figure>
            </div>
          ))}

          <div className="review-box__backtohomepage u-center-text">
            <Link href="/" className="btn-text">
              ← Back to Homepage
            </Link>
          </div>
        </main>
      </div>

      <footer className="footer footer--blue">
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
