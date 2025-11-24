export interface Experience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location: string;
    description?: string;
    bullets: string[];
}

export interface Education {
    school: string;
    degree: string;
    year: string;
}

export const resume = {
    summary: "I love building useful, delightful products, and helping others do the same. I lead with empathy, clarity, and speed, empowering teams to move fast, make sharp decisions, and learn quickly through actionable feedback loops. Currently, I lead Google’s next-gen AI-driven developer platform team.",
    experience: [
        {
            company: "Google",
            role: "Product Management Team Lead | Developer AI",
            startDate: "Oct 2023",
            endDate: "Present",
            location: "Seattle, WA",
            bullets: [
                "Founded and lead the team behind Google’s AI-driven internal developer platform, used by teams across Search, DeepMind, YouTube, and more.",
                "Pushing the boundaries of AI and human-agent collaboration to radically accelerate and transform how thousands of teams at Google build, deploy, and operate applications."
            ]
        },
        {
            company: "Google",
            role: "Product Manager | Google Core",
            startDate: "Oct 2021",
            endDate: "Oct 2023",
            location: "Seattle, WA",
            bullets: [
                "Served as product lead driving the northstar vision and working with 10+ engineering teams to launch Google's first centralized developer platform.",
                "Standardized key developer journeys across the company, making it easier and faster for teams to build, launch, and manage products at Google scale/quality."
            ]
        },
        {
            company: "Amazon",
            role: "Senior Product Manager - Technical | Amazon Kids",
            startDate: "Mar 2021",
            endDate: "Sep 2021",
            location: "Seattle, WA",
            bullets: [
                "Owned older kids experiences (6-12 years old) on Fire Kids Pro tablets.",
                "Developed strategy for a new kids-centric social product and launched a safe music discovery and listening experience spanning over 75M songs."
            ]
        },
        {
            company: "Amazon",
            role: "Senior Product Manager - Technical | AWS/Game Studios",
            startDate: "Oct 2018",
            endDate: "Feb 2021",
            location: "Seattle, WA",
            bullets: [
                "Drove 67% year-over-year paid member growth to 9M monthly engaged customers through six new major product launches.",
                "Drove roadmap definition and prioritization alignment for Prime Gaming customer experiences cross-functionally between seven functional and engineering teams.",
                "Launched new back-end architecture supporting all benefit discovery and claiming experiences in Prime Gaming."
            ]
        },
        {
            company: "Amazon",
            role: "Senior Product Manager | Retail Operations",
            startDate: "Jul 2017",
            endDate: "Sep 2018",
            location: "Seattle, WA",
            bullets: [
                "Launched suite of automated profitability and negotiations management tools world-wide to drive profit and revenue growth ($65M in incremental annualized free cash flow).",
                "Managed execution across 21 engineering and retail business teams."
            ]
        },
        {
            company: "Previous Experience",
            role: "Consulting & Research",
            startDate: "2005",
            endDate: "2017",
            location: "Various",
            description: "Prior to Amazon, I worked as a Senior Consultant at Hitachi Consulting leading business intelligence and digital transformation projects. I also have a background in Chemical Engineering research, having worked as a scientist at CBiRC and research assistant at Rice and Northwestern Universities, with a focus on metabolic engineering.",
            bullets: []
        }
    ] as Experience[],
    education: [
        {
            school: "MIT Sloan School of Management",
            degree: "Master of Business Administration (MBA)",
            year: "2015 - 2017"
        },
        {
            school: "Rice University",
            degree: "Master's Degree, Chemical Engineering",
            year: "2008 - 2011"
        },
        {
            school: "Northwestern University",
            degree: "Bachelor's Degree, Chemical Engineering",
            year: "2004 - 2008"
        }
    ] as Education[]
};
