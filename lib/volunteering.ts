export type Slide = {
  image: string;
  alt: string;
  // short label on the photo
  title: string;
  // shown when the photo is clicked
  story: string;
};

type Fact = { big: string; small: string };

export type ProjectId = "saladong" | "cff" | "cambodia40";

export type VolunteerProject = {
  id: ProjectId;
  // label on the switcher
  tab: string;
  kicker: string;
  title: string;
  khmer?: string;
  intro: string;
  did: string[];
  facts: Fact[];
  slides: Slide[];
};

export const volunteerProjects: VolunteerProject[] = [
  {
    id: "cambodia40",
    tab: "Cambodia 4.0 · Nov 2026",
    kicker: "18–20 November 2026 · Kompong Thom",
    title: "Robotics & AI literacy",
    intro:
      "With Cambodia 4.0, I spent three days in Kompong Thom province teaching students and older adults about robotics and AI literacy.",
    did: [
      "Introduced students to robotics through hands-on activities",
      "Helped older adults explore AI literacy",
      "Adapted explanations for different ages and levels of experience",
    ],
    facts: [
      { big: "3 days", small: "18–20 November" },
      { big: "Kompong Thom", small: "province" },
      { big: "Cambodia 4.0", small: "volunteer team" },
    ],
    slides: [
      {
        image: "/cambodia4.0/robotics.webp",
        alt: "Nuon Hokseng demonstrating robotics and helping students use a controller",
        title: "Hands-on robotics",
        story:
          "Introducing students to robotics with demonstrations and hands-on activities.",
      },
      {
        image: "/cambodia4.0/community.webp",
        alt: "Cambodia 4.0 volunteers with older community members in Kompong Thom",
        title: "Learning across generations",
        story:
          "Students and older adults joined the robotics and AI literacy outreach.",
      },
      {
        image: "/cambodia4.0/team.webp",
        alt: "The Cambodia 4.0 team presenting at the community workshop",
        title: "With Cambodia 4.0",
        story: "The volunteer team sharing ideas with the local community.",
      },
      {
        image: "/cambodia4.0/workshop.webp",
        alt: "Nuon Hokseng and community members during the Cambodia 4.0 workshop",
        title: "At the workshop",
        story: "A moment from the three-day outreach in Kompong Thom province.",
      },
    ],
  },
  {
    id: "saladong",
    tab: "Sala Dong · May 2024",
    kicker: "May 2024 · first volunteering",
    title: "Sala Dong",
    khmer: "សាលាដូង",
    intro:
      "After the semester break we did community service at Sala Dong, a small school on top of Kirirom mountain. It lets children from grade 1 to 6 keep learning even though they live in a remote area. Its founder has kept it going for almost 10 years, and we went to see how, and to help.",
    did: [
      "Built souvenirs from recycled materials",
      "Taught and discussed with the students",
      "Learned the school's history from its team",
      "Ran a real-life survey on the school's impact",
    ],
    facts: [
      { big: "1–6", small: "grades taught" },
      { big: "~10", small: "years running" },
      { big: "Kirirom", small: "mountain top" },
    ],
    slides: [
      {
        image: "/saladuong1.jpg",
        alt: "The volunteer team standing together in front of a Cambodian flag made from bottle caps",
        title: "Meeting the school",
        story:
          "We started by meeting the people behind Sala Dong. The hall around us is decorated with recycled bottle caps, even the Cambodian flag on the wall, and it set the tone for the whole stay: nothing here is wasted, everything gets a second life.",
      },
      {
        image: "/saladuong2.jpg",
        alt: "A volunteer threading bottle caps and straws into a souvenir at a blue table",
        title: "Building souvenirs",
        story:
          "We sat down with bottle caps, straws and thread to build souvenirs by hand. Slow, careful work, one cap at a time, and a good way to see how the school turns recycled material into something people want to take home.",
      },
      {
        image: "/saladuong3.jpg",
        alt: "A volunteer speaking to a group in front of the bottle-cap flag wall",
        title: "Talking it through",
        story:
          "Some of the best learning happened in conversation. We discussed with the students and the people running the school, and learned its history: how the founder started it and has kept it going for almost 10 years.",
      },
      {
        image: "/saladuong4.jpg",
        alt: "Four volunteers resting on a log among pine trees on Kirirom mountain",
        title: "Kirirom, between sessions",
        story:
          "A break under the pine trees. The school sits on top of Kirirom mountain, far from town, and that distance is the whole point: for many of the children, this is the one place close enough to learn in.",
      },
      {
        image: "/saladuong5.jpg",
        alt: "The whole volunteer group posing in front of Rubbish Cafe with a KIT logo made of bottle caps",
        title: "The whole crew",
        story:
          "Everyone together, holding up the KIT logo made from bottle caps. We also ran a real-life survey on how much Sala Dong changes things for the children, and what it means that grades 1 to 6 can study here even in a remote area.",
      },
    ],
  },
  {
    id: "cff",
    tab: "CFF Camp · Feb 2025",
    kicker: "9th – 13th February 2025",
    title: "CFF Camp",
    intro:
      "A volunteer camp led by a Japanese team, in Takeo province. We joined as their Cambodian buddies: explaining our culture, visiting a school much like Sala Dong, staying with local homestay families and ending the trip at an orphanage before heading back to Kirirom.",
    did: [
      "Were the Cambodian buddies of the Japanese team",
      "Explained our culture along the way",
      "Visited a school in Takeo, much like Sala Dong",
      "Stayed in a local homestay and played with the students",
      "Visited the orphanage in Traeng Trayeng (ត្រែងត្រយឹង)",
      "Campfire nights, then back to Kirirom",
    ],
    facts: [
      { big: "Takeo", small: "province" },
      { big: "Feb 2025", small: "9th – 13th" },
      { big: "Buddies", small: "to a Japanese team" },
    ],
    slides: [
      {
        image: "/camp2.jpg",
        alt: "Volunteers and dozens of village children posing in front of a blue schoolhouse",
        title: "Playing with the kids",
        story:
          "A blue schoolhouse, a crowd of kids and the Japanese team all squeezed into one photo. We played with the students, paper planes included. Our job as buddies was to stay close to our Japanese friends and make the day easy for everyone.",
      },
      {
        image: "/camp1.jpg",
        alt: "The volunteers posing at night with a local family under a lit shelter",
        title: "A night at the homestay",
        story:
          "We stayed in local homes, not a hotel. Here the Japanese volunteers and our team pose with a local family under the porch light. It is the best way to see everyday Cambodian life, and to explain it at the same time.",
      },
      {
        image: "/camp4.jpg",
        alt: "Volunteers, children and staff making heart shapes with their hands inside a school hall",
        title: "Hearts all around",
        story:
          "Heart hands from the children, the staff and the volunteers. Visiting places like this, a school like Sala Dong in Takeo and the orphanage in Traeng Trayeng, is what the camp was about.",
      },
      {
        image: "/camp3.jpg",
        alt: "The camp group in matching blue shirts in front of Rubbish Cafe in Kirirom",
        title: "Back at Kirirom",
        story:
          "We finished the trip by coming back to Kirirom, with a stop at Rubbish Café. Between the campfire nights, the games and everything else, the group got close. This is the whole team in matching blue shirts at the end.",
      },
    ],
  },
];
