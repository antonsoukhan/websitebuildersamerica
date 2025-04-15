import Image from "next/image";
import fs from "fs";
import path from "path";

// ⛔️ Broken images list – these failed to load or screenshot
const brokenScreenshots = new Set([
  "aaajohnstreeservice_com.png",
  "ruvimsautobody_com.png",
  "reisconstructionllc_com.png",
  "earthlandscapedesignandtreecare_com.png",
  "javiershandymanservices_com.png",
  "zachsflooring_com.png",
  "jerryautofix_com.png",
  "professionalweldingrepairs_com.png",
  "leonelstreeservice_com.png",
  "insulationexpertssd_com.png",
  "rjsdraincleaning_com.png",
  "brushclearingandyardcleanups_com.png",
  "martinezsidingroofing_com.png",
  "premierdrainllc_com.png",
  "roofingbycano_com.png",
  "jsremixedbyj_com.png",
  "sampaintingservice_com.png",
  "inkasremodeling_com.png",
  "autorepairlogistics_com.png",
  "all-techbuildingservices_com.png",
  "emh-llc_com.png",
  "navarrosfencing_com.png",
  "cervantesconstructionsouthbay_com.png",
  "vibemobileautorepair_com.png",
  "sandiegostressfreemovers_com.png",
  "americandreamhandymanservices_com.png",
]);

// ✅ Map filename to live website URL
const websiteMap = {
  "danshandymanservicestwincities_com_com.png":
    "https://www.danshandymanservicestwincities.com/",
  "blueladderdesignsconstruction_com_com.png":
    "https://www.blueladderdesignsconstruction.com/",
  "salondesimone_com_com.png": "https://www.salondesimone.com/",
  "jv-flooring_com_com.png": "https://www.jv-flooring.com/",
  "jjplumbing-heating_com_com.png": "https://www.jjplumbing-heating.com",
  "essentialtreeservices_net_com.png": "https://www.essentialtreeservices.net/",
  "mcgarveyconstruction_com_com.png": "https://mcgarveyconstruction.com/",
  "503landscape_com_com.png": "https://www.503landscape.com/",
  "tonysprofessionaltreeservice_com_com.png":
    "https://www.tonysprofessionaltreeservice.com/",
  "ghgarchitects_com_com.png": "https://www.ghgarchitects.com/",
  "katalex_org_com.png": "https://www.katalex.org/",
  "jillscreativedesigns_com_com.png": "https://www.jillscreativedesigns.com/",
  "noahsacademy_com_com.png": "https://www.noahsacademy.com/",
  "faithfuldoorsolutions_com_com.png": "https://www.faithfuldoorsolutions.com/",
  "bigfoottinyhouse_com_com.png": "https://www.bigfoottinyhouse.com/",
  "bobslandscapingpondsandwaterfalls_com_com.png":
    "https://www.bobslandscapingpondsandwaterfalls.com/",
  "hauldaddie_com.png": "https://www.hauldaddie.com/",
  "shinyglasssd_com.png": "https://www.shinyglasssd.com/",
  "gardunojunkremoval_com.png": "https://www.gardunojunkremoval.com/",
  "californiawindowglassrepair_com.png":
    "https://californiawindowglassrepair.com/",
  "titlconstruction_com.png": "https://www.titlconstruction.com/",
  "mixtecahandymanservices_com.png": "https://www.mixtecahandymanservices.com/",
  "brcconstructioncorporation_com.png":
    "https://brcconstructioncorporation.com/",
  "timsflooringllc_com.png": "https://timsflooringllc.com/",
  "fredskitchenandbathroomremodeling_com.png":
    "https://www.fredskitchenandbathroomremodeling.com/",
  "allinoneandbrothersremodeling_com.png":
    "https://www.allinoneandbrothersremodeling.com/",
  "bianchiconcrete_com.png": "http://bianchiconcrete.com/",
  "alwaysdiamondlimo_com.png": "https://www.alwaysdiamondlimo.com/",
  "professionalcarpetcleaningsacramento_com.png":
    "https://professionalcarpetcleaningsacramento.com/",
  "nwsanctuaryllc_com.png": "https://www.nwsanctuaryllc.com/",
  "whitneylathan_com.png": "https://www.whitneylathan.com/",
  "superstarjunkremoval_com.png": "https://www.superstarjunkremoval.com/",
  "ezplumbingmn_com.png": "https://ezplumbingmn.com/",
  "gmplumbingla_com.png": "https://www.gmplumbingla.com/",
  "khaosparrish_com.png": "https://www.khaosparrish.com/",
  "hwbrowntreeexperts_com.png": "https://www.hwbrowntreeexperts.com/",
  "connorsconstructionstpaul_com.png":
    "https://www.connorsconstructionstpaul.com/",
  "honest-mechanics_com.png": "https://www.honest-mechanics.com/",
  "wilmobileautorepair_com.png": "https://www.wilmobileautorepair.com/",
  "jonthehandyman_com.png": "https://www.jonthehandyman.com/",
  "salvadorketzgardening_com.png": "https://www.salvadorketzgardening.com/",
  "thecaptainsgotit_com.png": "https://www.thecaptainsgotit.com/",
  "reillyshomeremodeling_com.png": "https://www.reillyshomeremodeling.com/",
};

export default function PortfolioPage() {
  const screenshots = fs
    .readdirSync("public/portfolio")
    .filter((file) => file.endsWith(".png") && !brokenScreenshots.has(file));

  return (
    <main>
      <section className="portfolio-section-blue">
        <h1 className="heading-1 u-center-text u-margin-bottom-large">
          Portfolio
        </h1>
        <div className="portfolio">
          {screenshots.map((filename, i) => {
            const link = websiteMap[filename];
            return (
              <figure className="portfolio__container" key={i}>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link}
                  >
                    <Image
                      src={`/portfolio/${filename}`}
                      alt={`Screenshot of ${link}`}
                      width={1200}
                      height={800}
                      className="portfolio__photo"
                    />
                  </a>
                ) : (
                  <Image
                    src={`/portfolio/${filename}`}
                    alt={`Screenshot ${filename}`}
                    width={1200}
                    height={800}
                    className="portfolio__photo"
                  />
                )}
              </figure>
            );
          })}
        </div>
      </section>
    </main>
  );
}
