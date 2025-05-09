import * as React from "react";

import { ok as assert } from "assert";

import { FormattedReading } from "@/components/FormattedReading";
import { CourseDataLink } from "@/components/links/CourseDataLink";
import { default as ContentContributionsInHCI } from "@/content/ContributionsInHCI.mdx";
import { default as ContentNoReading } from "@/content/NoReading.mdx";
import { default as ContentVisionsOfHCI } from "@/content/VisionsOfHCI.mdx";
import { SiteLinks } from "@/data/SiteLinks";
import {
  AssignmentCalendarItem,
  AwayCalendarItem,
  CalendarDate,
  CalendarItem,
  CalendarWeek,
  EventCalendarItem,
  HolidayCalendarItem,
  LectureCalendarItem,
  OfficeHourCalendarItem,
  StudioCalendarItem,
} from "@/types/CalendarData";
import {
  clamp as clampDate,
  format as datefnsFormat,
  isValid as datefnsIsValid,
  parse as datefnsParse,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
} from "date-fns";

const dayOfWeekValues = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;
type dayOfWeek = (typeof dayOfWeekValues)[number];

const TIME_AND_LOCATION_LECTURE = {
  time: "10:00 to 11:20",
  location: "BAG 108",
};

const TIME_AND_LOCATION_SHOWCASE = {
  time: "10:00 to 11:20",
  location: "CSE/Allen Atrium",
};

export function parseCalendarDate(calendarDate: CalendarDate): Date {
  const parsedDate = datefnsParse(calendarDate, "yyyy-MM-dd", new Date());
  assert(datefnsIsValid(parsedDate), `Invalid date: ${calendarDate}`);

  return parsedDate;
}

export function formatCalendarDate(
  calendarDate: CalendarDate,
  format: string,
): string {
  return datefnsFormat(parseCalendarDate(calendarDate), format);
}

export function calendarDates(): CalendarDate[] {
  return eachDayOfInterval({
    start: parseCalendarDate(calendarData.datesOfInstruction.start),
    end: parseCalendarDate(calendarData.datesOfInstruction.end),
  }).map((dateCurrent: Date): CalendarDate => {
    return datefnsFormat(dateCurrent, "yyyy-MM-dd");
  });
}

export function calendarWeeks(): CalendarWeek[] {
  return eachWeekOfInterval({
    start: parseCalendarDate(calendarData.datesOfInstruction.start),
    end: parseCalendarDate(calendarData.datesOfInstruction.end),
  }).map((weekCurrent: Date): CalendarWeek => {
    return {
      startDate: datefnsFormat(weekCurrent, "yyyy-MM-dd"),
      dates: eachDayOfInterval({
        start: clampDate(weekCurrent, {
          start: parseCalendarDate(calendarData.datesOfInstruction.start),
          end: parseCalendarDate(calendarData.datesOfInstruction.end),
        }),
        end: clampDate(endOfWeek(weekCurrent), {
          start: parseCalendarDate(calendarData.datesOfInstruction.start),
          end: parseCalendarDate(calendarData.datesOfInstruction.end),
        }),
      }).map((dateCurrent): CalendarDate => {
        return datefnsFormat(dateCurrent, "yyyy-MM-dd");
      }),
    };
  });
}

export function calendarItems(): CalendarItem[] {
  return [
    ...Object.values(calendarData.assignments),
    ...calendarData.aways,
    ...calendarData.events,
    ...calendarData.holidays,
    ...calendarData.lectures,
    ...calendarData.officeHours,
    ...calendarData.studios,
  ];
}

export function calendarItemsForDate(
  calendarDate: CalendarDate,
): CalendarItem[] {
  return calendarItems().filter(
    (calendarItemCurrent: CalendarItem): boolean => {
      if ("date" in calendarItemCurrent) {
        return calendarDate === calendarItemCurrent.date;
      } else {
        return calendarItemCurrent.dates.includes(calendarDate);
      }
    },
  );
}

function verifyCalendarDate(
  calendarDate: CalendarDate,
  dayOfWeek: dayOfWeek,
): CalendarDate {
  assert(dayOfWeekValues.includes(dayOfWeek));

  const parsedDate = parseCalendarDate(calendarDate);
  const parsedDateDayOfWeek = datefnsFormat(parsedDate, "EEE");
  assert(
    parsedDateDayOfWeek === dayOfWeek,
    `Date ${calendarDate} is not ${dayOfWeek}`,
  );

  return calendarDate;
}

export const calendarData: {
  datesOfInstruction: {
    start: CalendarDate;
    end: CalendarDate;
  };
  assignments: { [key: string]: AssignmentCalendarItem };
  aways: AwayCalendarItem[];
  events: EventCalendarItem[];
  holidays: HolidayCalendarItem[];
  lectures: LectureCalendarItem[];
  officeHours: OfficeHourCalendarItem[];
  studios: StudioCalendarItem[];
} = {
  datesOfInstruction: {
    start: verifyCalendarDate("2025-03-31", "Mon"),
    end: verifyCalendarDate("2025-06-13", "Fri"),
  },

  assignments: {
    labSlidesAndVideo: {
      type: "assignment",
      title:
        "Technology Lab: GitLab Code, Video Demonstration, Reflection, Slide",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-18", "Fri"),
    },
    labPresentation: {
      type: "assignment",
      title: "Technology Lab: Presentation",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-22", "Tue"),
    },

    projectIntroductionAndIdeaSlides: {
      type: "assignment",
      title: "Project: Introduction and Idea Slides",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-02", "Wed"),
    },
    projectIntroductionAndIdeaPresentation: {
      type: "assignment",
      title: "Project: Introduction and Idea Presentation",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-03", "Thu"),
    },
    projectGroupBrainstorm: {
      type: "assignment",
      title: "Project: Group Brainstorm",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-09", "Wed"),
    },
    projectGroupsFinalized: {
      type: "assignment",
      title: "Project: Groups Finalized",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-13", "Sun"),
    },
    projectTempMilestone1: {
      type: "assignment",
      title: "Project: Design Proposal",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-21", "Mon"),
    },
    projectTempMilestone2: {
      type: "assignment",
      title: "Project: Formative Design Research",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-04-30", "Wed"),
    },
    projectTempMilestone3: {
      type: "assignment",
      title: "Project: Interactive Prototype",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-05-11", "Sun"),
    },
    projectTempMilestone5: {
      type: "assignment",
      title: "Project: Peer Evaluation and Testing",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-05-18", "Sun"),
    },
    projectTempMilestone4: {
      type: "assignment",
      title: "Project: Revised Prototype",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-05-25", "Sun"),
    },
    projectTempMilestone6: {
      type: "assignment",
      title: "Project: Usability Testing and Final Prototype",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-06-01", "Sun"),
    },

    projectShowcasePoster: {
      type: "assignment",
      title: "Project: Poster",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-05-30", "Fri"),
    },
    projectShowcaseSession: {
      type: "assignment",
      title: "Project: Poster Session",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-06-05", "Thu"),
    },

    /*
    projectProposal: {
      type: "assignment",
      title: "Project Proposal",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-01-26", "Sun"),
      submission: "canvas",
      submitCanvasTime: "5:00pm",
      submitCanvasLink:
        "https://canvas.uw.edu/courses/1786160/assignments/10004413",
    },
    projectMilestoneReport1: {
      type: "assignment",
      title: "Project Milestone Report",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-02-09", "Sun"),
      submission: "canvas",
      submitCanvasTime: "5:00pm",
      submitCanvasLink:
        "https://canvas.uw.edu/courses/1786160/assignments/10004474",
    },
    projectMilestoneReport2: {
      type: "assignment",
      title: "Project Milestone Report",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-03-02", "Sun"),
      submission: "canvas",
      submitCanvasTime: "5:00pm",
      submitCanvasLink:
        "https://canvas.uw.edu/courses/1786160/assignments/10004475",
    },
    projectFinalReport: {
      type: "assignment",
      title: "Project Final Report",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-03-17", "Mon"),
      submission: "canvas",
      submitCanvasTime: "5:00pm",
      submitCanvasLink:
        "https://canvas.uw.edu/courses/1786160/assignments/10004476",
    },
    // Copy-paste needed because typing currently cannot handle "dates"
    projectMilestoneMeetings1Tue: {
      type: "assignment",
      title: "Project Milestone Meetings",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-02-11", "Tue"),
    },
    projectMilestoneMeetings1Thu: {
      type: "assignment",
      title: "Project Milestone Meetings",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-02-13", "Thu"),
    },
    projectMilestoneMeetings2Tue: {
      type: "assignment",
      title: "Project Milestone Meetings",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-03-04", "Tue"),
    },
    projectMilestoneMeetings2Thu: {
      type: "assignment",
      title: "Project Milestone Meetings",
      link: SiteLinks.assignmentsProjectTop.href,
      date: verifyCalendarDate("2025-03-06", "Thu"),
    },
*/
  },

  aways: [
    {
      date: verifyCalendarDate("2025-04-22", "Tue"),
      type: "away",
      title: "Mingyuan at CHI 2025",
    },
    {
      date: verifyCalendarDate("2025-04-24", "Thu"),
      type: "away",
      title: "James and Mingyuan at CHI 2025",
    },
    {
      date: verifyCalendarDate("2025-04-29", "Tue"),
      type: "away",
      title: "James and Mingyuan at CHI 2025",
    },
    {
      date: verifyCalendarDate("2025-05-01", "Thu"),
      type: "away",
      title: "James and Mingyuan at CHI 2025",
    },
  ],

  events: [],

  holidays: [
    {
      date: verifyCalendarDate("2025-05-26", "Mon"),
      type: "holiday",
      title: "Memorial Day",
    },
  ],

  lectures: [
    // Week 1
    {
      date: verifyCalendarDate("2025-04-01", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Course Overview",
      discussionPapers: [
        {
          authorText:
            "Michael S. Bernstein, Greg Little, Robert C. Miller, Björn Hartmann, Mark S. Ackerman, David R. Karger, David Crowell, Katrina Panovich",
          title: "Soylent: A Word Processor with a Crowd Inside",
          publicationText: "UIST 2010",
          link: "https://canvas.uw.edu/files/132826278/",
        },
      ],
    },
    {
      date: verifyCalendarDate("2025-04-03", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Introductions and Project Ideas",
    },

    // Week 2
    {
      date: verifyCalendarDate("2025-04-08", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Principles of Human-AI Interaction",
      discussionPapers: [
        {
          authorText: "Eric Horvitz",
          title: "Principles of Mixed-Initiative User Interfaces",
          publicationText: "CHI 1999",
          link: "https://canvas.uw.edu/files/132761885/",
        },
        {
          authorText:
            "Saleema Amershi, Dan Weld, Mihaela Vorvoreanu, Adam Fourney, Besmira Nushi, Penny Collisson, Jina Suh, Shamsi Iqbal, Paul N. Bennett, Kori Inkpen, Jaime Teevan, Ruth Kikin-Gil, Eric Horvitz",
          title: "Guidelines for Human-AI Interaction",
          publicationText: "CHI 2019",
          link: "https://canvas.uw.edu/files/132762356/",
        },
        {
          authorText:
            "Gagan Bansal, Jennifer Wortman Vaughan, Saleema Amershi, Eric Horvitz, Adam Fourney, Hussein Mozannar, Victor Dibia, Daniel S. Weld",
          title: "Challenges in Human-Agent Communication",
          publicationText: "arXiv. 2024",
          link: "https://canvas.uw.edu/files/132762258/",
        },
        {
          authorText:
            "Hariharan Subramonyam, Jane Im, Colleen Seifert, Eytan Adar",
          title:
            "Solving Separation-of-Concerns Problems in Collaborative Design of Human-AI Systems through Leaky Abstractions",
          publicationText: "CHI 2022",
          link: "https://canvas.uw.edu/files/132768251/",
        },
      ],
    },
    {
      date: verifyCalendarDate("2025-04-10", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Designing for Human-AI Interaction",
      discussionPapers: [
        {
          authorText:
            "J.D. Zamfirescu-Pereira, Richmond Y. Wong, Bjoern Hartmann, Qian Yang",
          title:
            "Why Johnny Can’t Prompt: How Non-AI Experts Try (and Fail) to Design LLM Prompts",
          publicationText: "CHI 2023",
          link: "https://canvas.uw.edu/files/132826450/",
        },
        {
          authorText:
            "Tim Zindulka, Jannek Sekowski, Florian Lehmann, Daniel Buschek",
          title:
            "Exploring Mobile Touch Interaction with Large Language Models",
          publicationText: "CHI 2025",
          link: "https://canvas.uw.edu/files/132826451/",
        },
        {
          authorText:
            "Damien Masson, Sylvain Malacria, Géry Casiez, Daniel Vogel",
          title:
            "DirectGPT: A Direct Manipulation Interface to Interact with Large Language Models",
          publicationText: "CHI 2024",
          link: "https://canvas.uw.edu/files/132826447/",
        },
        {
          authorText:
            'Zachary Englhardt, Chengqian Ma, Margaret E. Morris, Chun-Cheng Chang, Xuhai "Orson" Xu, Lianhui Qin, Daniel McDuff, Xin Liu, Shwetak Patel, Vikram Iyer',
          title:
            "From Classification to Clinical Insights: Towards Analyzing and Reasoning About Mobile and Behavioral Health Data With Large Language Models",
          publicationText: "IMWUT 2024",
          link: "https://canvas.uw.edu/files/132826446/",
        },
      ],
    },

    // Week 3
    {
      date: verifyCalendarDate("2025-04-15", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Designing for Human-AI Interaction",
      discussionPapers: [
        {
          authorText:
            "Peitong Duan, Chin-Yi Cheng, Gang Li, Bjoern Hartmann, Yang Li",
          title:
            "UICrit: Enhancing Automated Design Evaluation with a UI Critique Dataset",
          publicationText: "UIST 2024",
          link: "https://canvas.uw.edu/files/132854975/",
        },
        {
          authorText:
            "Xingyu Bruce Liu, Shitao Fang, Weiyan Shi, Chien-Sheng Wu, Takeo Igarashi, Xiang Anthony Chen",
          title: "Proactive Conversational Agents with Inner Thoughts",
          publicationText: "CHI 2025",
          link: "https://canvas.uw.edu/files/132854974/",
        },
      ],
    },
    {
      date: verifyCalendarDate("2025-04-17", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Designing for Human-AI Interaction",
      discussionPapers: [
        {
          authorText: "Joshua Gorniak, Yoon Kim, Donglai Wei, Nam Wook Kim",
          title:
            "VizAbility: Enhancing Chart Accessibility with LLM-based Conversational Interaction",
          publicationText: "UIST 2024",
          link: "https://canvas.uw.edu/files/132854980/",
        },
        {
          authorText:
            "Taewan Kim, Seolyeong Bae, Hyun Ah Kim, Su-Woo Lee, Hwajung Hong, Chanmo Yang, Young-Ho Kim",
          title:
            "MindfulDiary: Harnessing Large Language Model to Support Psychiatric Patients’ Journaling",
          publicationText: "CHI 2024",
          link: "https://canvas.uw.edu/files/132854979/",
        },
      ],
    },

    // Week 4
    {
      date: verifyCalendarDate("2025-04-22", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Technology Lab Presentations",
    },
    {
      date: verifyCalendarDate("2025-04-24", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Project Working Time",
    },

    // Week 5
    {
      date: verifyCalendarDate("2025-04-29", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Project Working Time",
    },
    {
      date: verifyCalendarDate("2025-05-01", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Project Working Time",
    },

    // Week 6
    {
      date: verifyCalendarDate("2025-05-06", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Project Meetings",
    },
    {
      date: verifyCalendarDate("2025-05-08", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Human-AI Interaction in Context",
      discussionPapers: [
        {
          authorText: "Dhruv Agarwal, Mor Naaman, Aditya Vashistha",
          title:
            "AI Suggestions Homogenize Writing Toward Western Styles and Diminish Cultural Nuances",
          publicationText: "CHI 2025",
          link: "https://canvas.uw.edu/files/134315593/",
        },
        {
          authorText:
            "Aaleyah Lewis, Aayushi Dangol, Hyewon Suh, Abbie Olszewski, James Fogarty, Julie A. Kientz",
          title:
            "Exploring AI-Based Support in Speech-Language Pathology for Culturally and Linguistically Diverse Children",
          publicationText: "CHI 2025",
          link: "https://canvas.uw.edu/files/134315596/",
        },
      ],
    },

    // Week 7
    {
      date: verifyCalendarDate("2025-05-13", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "TBD",
    },
    {
      date: verifyCalendarDate("2025-05-15", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Human-AI Interaction in Context",
      discussionPapers: [
        {
          authorText: "Jijie Zhou, Eryue Xu, Yaoyao Wu, Tianshi Li",
          title:
            "Rescriber: Smaller-LLM-Powered User-Led Data Minimization for LLM-Based Chatbots",
          publicationText: "CHI 2025",
          link: "https://canvas.uw.edu/files/134421728/",
        },
        {
          authorText:
            "Weiran Lin, Anna Gerchanovsky, Omer Akgul, Lujo Bauer, Matt Fredrikson, Zifan Wang",
          title: "LLM Whisperer: An Inconspicuous Attack to Bias LLM Responses",
          publicationText: "CHI 2025",
          link: "https://canvas.uw.edu/files/134421732/",
        },
      ],
    },

    // Week 8
    {
      date: verifyCalendarDate("2025-05-20", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Human-AI Interaction in Industry",
      guest: {
        name: "Amanda Swearngin",
        link: "https://amaswea.github.io/",
      },
      discussionPapers: [
        {
          authorText:
            "Maryam Taeb, Amanda Swearngin, Eldon Schoop, Ruijia Cheng, Yue Jiang, Jeffrey Nichols",
          title: "AXNav: Replaying Accessibility Tests from Natural Language",
          publicationText: "CHI 2024",
          link: "https://canvas.uw.edu/files/134336791/",
        },
      ],
    },
    {
      date: verifyCalendarDate("2025-05-22", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "TBD",
    },

    // Week 9
    {
      date: verifyCalendarDate("2025-05-27", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Human-AI Interaction in Industry",
      guest: {
        name: "Gagan Bansal",
        link: "https://gagb.github.io/",
      },
      discussionPapers: [
        {
          authorText:
            "Adam Fourney, Gagan Bansal, Hussein Mozannar, Cheng Tan, Eduardo Salinas, Erkang (Eric) Zhu, Friederike Niedtner, Grace Proebsting, Griffin Bassman, Jack Gerrits, Jacob Alber, Peter Chang, Ricky Loynd, Robert West, Victor Dibia, Ahmed Awadallah, Ece Kamar, Rafah Hosn, Saleema Amershi",
          title:
            "Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks",
          publicationText: "arXiv. 2024",
          link: "https://canvas.uw.edu/files/134605309/",
        },
      ],
    },
    {
      date: verifyCalendarDate("2025-05-29", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "TBD",
    },

    // Week 10
    {
      date: verifyCalendarDate("2025-06-03", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Project Presentations",
    },
    {
      date: verifyCalendarDate("2025-06-05", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_SHOWCASE,
      type: "lecture",
      title: "Project Showcase",
    },

    /*
    // Week 1
    {
      date: verifyCalendarDate("2025-01-07", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Introductions and Overview",
      contentNonstandard: <ContentNoReading />,
    },
    {
      date: verifyCalendarDate("2025-01-09", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Visions of Human-Computer Interaction",
      contentNonstandard: (
        <ContentVisionsOfHCI
          readings={{
            visions: [
              {
                // Because this paper is reviewed in history discussion,
                // text below clarifies it can be read but will not be presented
                authorText: "Vannevar Bush",
                title: "As We May Think",
                publicationText: "The Atlantic. 1945",
                link: "https://theatlantic.com/magazine/archive/1945/07/as-we-may-think/303881/",
              },
              {
                authorText: "Mark Weiser",
                title: "The Computer for the 21st Century",
                publicationText: "Scientific American. 1991",
                link: "https://canvas.uw.edu/files/128522123/",
              },
              // {
              //   authorText:
              //     "Roy Want, Andy Hopper, Veronica Falcão, Jonathan Gibbons",
              //   title: "The Active Badge Location System",
              //   publicationText: "TOIS. 1992",
              // },
              {
                authorText: "James D. Hollan, Scott Stornetta",
                title: "Beyond Being There",
                publicationText: "CHI 1992",
                link: "https://canvas.uw.edu/files/128522136/",
              },
              {
                authorText: "Pierre Wellner",
                title: "Interacting with Paper on the DigitalDesk",
                publicationText: "CACM. 1993",
                link: "https://canvas.uw.edu/files/128522133/",
              },
              {
                authorText: "Benjamin B. Bederson, James D. Hollan",
                title:
                  "Pad++: A Zooming Graphical Interface for Exploring Alternate Interface Physics",
                publicationText: "UIST 1994",
                link: "https://canvas.uw.edu/files/128522138/",
              },
              {
                authorText: "Hiroshi Ishii, Brygg Ullmer",
                title:
                  "Tangible Bits: Towards Seamless Interfaces between People, Bits and Atoms",
                publicationText: "CHI 1997",
                link: "https://canvas.uw.edu/files/128522130/",
              },
              {
                authorText: "Eric Horvitz",
                title: "Principles of Mixed-Initiative User Interfaces",
                publicationText: "CHI 1999",
                link: "https://canvas.uw.edu/files/128522135/",
              },
              {
                authorText:
                  "Ken Hinckley, Jeff Pierce, Mike Sinclair, Eric Horvitz",
                title: "Sensing Techniques for Mobile Interaction",
                publicationText: "UIST 2000",
                link: "https://canvas.uw.edu/files/128522137/",
              },
              // {
              //   authorText: "Claudio S. Pinhanez",
              //   title:
              //     "The Everywhere Displays Projector: A Device to Create Ubiquitous Graphical Interfaces",
              //   publicationText: "UbiComp 2001",
              // },
              {
                authorText: "Saul Greenberg, Chester Fitchett",
                title:
                  "Phidgets: Easy Development of Physical Interfaces through Physical Widgets",
                publicationText: "UIST 2001",
                link: "https://canvas.uw.edu/files/128522141/",
              },
              {
                authorText:
                  "Roy Want, Trevor Pering, Gunner Danneels, Muthu Kumar, Murali Sundar, John Light",
                title:
                  "The Personal Server: Changing the Way We Think about Ubiquitous Computing",
                publicationText: "UbiComp 2002",
                link: "https://canvas.uw.edu/files/128522131/",
              },
              {
                authorText:
                  "Anthony LaMarca, Yatin Chawathe, Sunny Consolvo, Jeffrey Hightower, Ian Smith, James Scott, Timothy Sohn, James Howard, Jeff Hughes, Fred Potter, Jason Tabert, Pauline Powledge, Gaetano Borriello, Bill Schilit",
                title:
                  "Place Lab: Device Positioning Using Radio Beacons in the Wild",
                publicationText: "Pervasive 2005",
                link: "https://canvas.uw.edu/files/128624083/",
              },
              {
                authorText:
                  "Jonathan Lester, Tanzeem Choudhury, Gaetano Borriello",
                title:
                  "A Practical Approach to Recognizing Physical Activities",
                publicationText: "Pervasive 2006",
                link: "https://canvas.uw.edu/files/128522134/",
              },
              {
                authorText: "Bret Victor",
                title:
                  "Magic Ink: Information Software and the Graphical Interface",
                publicationText: "2006",
                link: "http://worrydream.com/MagicInk/",
              },
              {
                authorText:
                  "Michael S. Bernstein, Greg Little, Robert C. Miller, Björn Hartmann, Mark S. Ackerman, David R. Karger, David Crowell, Katrina Panovich",
                title: "Soylent: A Word Processor with a Crowd Inside",
                publicationText: "UIST 2010",
                link: "https://canvas.uw.edu/files/128522142/",
              },
              {
                authorText:
                  "Chris Harrison, Hrvoje Benko, and Andrew D. Wilson",
                title: "OmniTouch: Wearable Multitouch Interaction Everywhere",
                publicationText: "UIST 2011",
                link: "https://canvas.uw.edu/files/128558642/",
              },
            ],
          }}
        />
      ),
    },
    // Week 2
    {
      date: verifyCalendarDate("2025-01-14", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Contributions in Human-Computer Interaction",
      contentNonstandard: (
        <ContentContributionsInHCI
          readings={{
            framing: {
              authorText: "Jacob O. Wobbrock, Julie A. Kientz",
              title: "Research Contributions in Human-Computer Interaction",
              publicationText: "Interactions. 2016",
              link: "https://canvas.uw.edu/files/128522132/",
            },
          }}
        />
      ),
      //   additionalResourceReadings: [
      //     {
      //       authorText: "Herbert A. Simon",
      //       title: "The Science of Design: Creating the Artificial",
      //       publicationText: "Design Issues, 1988",
      //       link: "https://canvas.uw.edu/files/109669331/",
      //     },
      //     {
      //       authorText: "Donald E. Stokes",
      //       title:
      //         "Pasteur’s Quadrant: Basic Science and Technological Innovation",
      //       publicationText: "Book Chapter, 1997",
      //       link: "https://canvas.uw.edu/files/109669330/",
      //     },
      //   ],
    },
    {
      date: verifyCalendarDate("2025-01-16", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "In-Class Time for Project Groups",
      contentNonstandard: <ContentNoReading />,
    },
    // Week 3
    {
      date: verifyCalendarDate("2025-01-21", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Human-Computer Interaction History",
      contentNonstandard: <ContentNoReading />,
      additionalResourceReadings: [
        {
          authorText: "Jonathan Grudin",
          title:
            "A Moving Target - The Evolution of Human-Computer Interaction",
          publicationText: "Book Chapter",
          link: "https://canvas.uw.edu/files/128522161/",
        },
      ],
    },
    {
      date: verifyCalendarDate("2025-01-23", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Usability Evaluation Considered Harmful",
      readingsStandard: {
        framing: {
          authorText: "Saul Greenberg, Bill Buxton",
          title: "Usability Evaluation Considered Harmful (Some of the Time)",
          publicationText: "CHI 2008",
          link: "https://canvas.uw.edu/files/128522177/",
        },
        instances: [
          {
            authorText: "Dan R. Olsen, Jr",
            title: "Evaluating User Interface Systems Research",
            publicationText: "UIST 2007",
            link: "https://canvas.uw.edu/files/128522160/",
          },
          {
            authorText: "James Fogarty",
            title: "Code and Contribution in Interactive Systems Research",
            publicationText:
              "CHI 2017 Workshop on #HCI.Tools: Strategies and Best Practices for Designing, Evaluating, and Sharing Technical HCI Toolkits",
            link: "https://canvas.uw.edu/files/128522176/",
          },
        ],
      },
    },
    // Week 4
    {
      date: verifyCalendarDate("2025-01-28", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Design Tools",
      readingsStandard: {
        framing: {
          authorText:
            "Mark W. Newman, James Lin, Jason I. Hong, James A. Landay",
          title:
            "DENIM: An Informal Web Site Design Tool Inspired by Observations of Practice",
          publicationText: "HCI. 2003",
          link: "https://canvas.uw.edu/files/128522164/",
        },
        instances: [
          {
            authorText:
              "Stefanie Mueller, Sangha Im, Serafima Gurevich, Alexander Teibrich, Lisa Pfisterer, François Guimbretière, Patrick Baudisch",
            title: "WirePrint: 3D Printed Previews for Fast Prototyping",
            publicationText: "UIST 2014",
            link: "https://canvas.uw.edu/files/128522165/",
          },
          {
            authorText: "Peitong Duan, Jeremy Warner, Yang Li, Bjoern Hartmann",
            title:
              "Generating Automatic Feedback on UI Mockups with Large Language Models",
            publicationText: "CHI 2024",
            link: "https://canvas.uw.edu/files/128707087/",
          },
        ],
      },
    },
    {
      date: verifyCalendarDate("2025-01-30", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Participatory Approaches to AI",
      guest: {
        name: "Amy X. Zhang",
        link: "https://homes.cs.washington.edu/~axz/",
      },
      readingsStandard: {
        framing: {
          authorText:
            "Saleema Amershi, Maya Cakmak, W. Bradley Knox, Todd Kulesza",
          title:
            "Power to the People: The Role of Humans in Interactive Machine Learning",
          publicationText: "AI Magazine. 2014",
          link: "https://canvas.uw.edu/files/129241122/",
        },
        instances: [
          {
            authorText:
              "Min Kyung Lee, Daniel Kusbit, Anson Kahng, Ji Tae Kim, Xinran Yuan, Allissa Chan, Daniel See, Ritesh Noothigattu, Siheon Lee, Alexandros Psomas, Ariel D. Procaccia",
            title:
              "WeBuildAI: Participatory Framework for Algorithmic Governance",
            publicationText: "CSCW 2019",
            link: "https://canvas.uw.edu/files/129241182/",
          },
          {
            authorText:
              "Mitchell L. Gordon, Michelle S. Lam, Joon Sung Park, Kayur Patel, Jeff Hancock, Tatsunori Hashimoto, Michael S. Bernstein",
            title:
              "Jury Learning: Integrating Dissenting Voices into Machine Learning Models",
            publicationText: "CHI 2022",
            link: "https://canvas.uw.edu/files/129241151/",
          },
        ],
      },
    },
    // Week 5
    {
      date: verifyCalendarDate("2025-02-04", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Designing with Children",
      guest: {
        name: "Jason Yip",
        link: "https://bigyipper.com/",
      },
      readingsStandard: {
        framing: {
          authorText:
            "Jason C. Yip, Kiley Sobel, Caroline Pitt, Kung Jin Lee, Sijin Chen, Kari Nasu, Laura R. Pina",
          title:
            "Examining Adult-Child Interactions in Intergenerational Participatory Design",
          publicationText: "CHI 2017",
          link: "https://canvas.uw.edu/files/129499290/",
        },
        instances: [
          {
            authorText:
              "Kung Jin Lee, Wendy Roldan, Tian Qi Zhu, Harkiran Kaur Saluja, Sungmin Na, Britnie Chin, Yilin Zeng, Jin Ha Lee, Jason Yip",
            title:
              "The Show Must Go On: A Conceptual Model of Conducting Synchronous Participatory Design With Children Online",
            publicationText: "CHI 2021",
            link: "https://canvas.uw.edu/files/129499288/",
          },
          {
            authorText:
              "Elana B. Blinder, Marshini Chetty, Jessica Vitak, Zoe Torok, Salina Fessehazion, Jason Yip, Jerry Alan Fails, Elizabeth Bonsignore, Tamara Clegg",
            title:
              "Evaluating the Use of Hypothetical 'Would You Rather' Scenarios to Discuss Privacy and Security Concepts with Children",
            publicationText: "CSCW 2024",
            link: "https://canvas.uw.edu/files/129499286/",
          },
        ],
      },
    },
    {
      date: verifyCalendarDate("2025-02-06", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: CSCW and Social Computing",
      guest: {
        name: "Mako Hill",
        link: "https://mako.cc/",
      },
      readingsStandard: {
        framing: {
          authorText: "Mark S. Ackerman",
          title:
            "The Intellectual Challenge of CSCW: The Gap Between Social Requirements and Technical Feasibility",
          publicationText: "HCI. 2000",
          link: "https://canvas.uw.edu/files/130016049/",
        },
        instances: [
          {
            authorText:
              "Aaron Halfaker, R. Stuart Geiger, Jonathan T. Morgan, John Riedl",
            title:
              "The Rise and Decline of an Open Collaboration System: How Wikipedia’s Reaction to Popularity Is Causing Its Decline",
            publicationText: "American Behavioral Scientist 2012",
            link: "https://canvas.uw.edu/files/130016050/",
          },
          {
            authorText:
              "Morten Warncke-Wang, Rita Ho, Marshall Miller, Isaac Johnson",
            title:
              "Increasing Participation in Peer Production Communities with the Newcomer Homepage",
            publicationText: "CSCW 2023",
            link: "https://canvas.uw.edu/files/130016264/",
          },
        ],
      },
    },
    // Week 7
    {
      date: verifyCalendarDate("2025-02-18", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Accessibility",
      guest: {
        name: "Martez Mott",
        link: "http://www.martezmott.com/",
      },
      readingsStandard: {
        framing: {
          authorText:
            "Jacob O. Wobbrock, Krzysztof Z. Gajos, Shaun K. Kane, Gregg C. Vanderheiden",
          title: "Ability-Based Design",
          publicationText: "CACM. 2018",
          link: "https://canvas.uw.edu/files/129729209/",
        },
        instances: [
          {
            authorText: "Rachel L. Franz, Sasa Junuzovic, Martez Mott",
            title:
              "Nearmi: A Framework for Designing Point of Interest Techniques for VR Users with Limited Mobility",
            publicationText: "ASSETS 2021",
            link: "https://canvas.uw.edu/files/129729206/",
          },
          {
            authorText:
              "Momona Yamagami, Sasa Junuzovic, Mar Gonzalez-Franco, Eyal Ofek, Edward Cutrell, John R. Porter, Andrew D. Wilson, Martez E. Mott",
            title:
              "Two-In-One: A Design Space for Mapping Unimanual Input into Bimanual Interactions in VR for Users with Limited Movement",
            publicationText: "TACCESS. 2022",
            link: "https://canvas.uw.edu/files/129729434/",
          },
        ],
      },
    },
    {
      date: verifyCalendarDate("2025-02-20", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title:
        "Research Topic: Information and Communication Technologies and Development",
      guest: {
        name: "Kurtis Heimerl",
        link: "https://kurti.sh/",
      },
      readingsStandard: {
        framing: {
          authorText:
            "Lilly Irani, Janet Vertesi, Paul Dourish, Kavita Philip, Rebecca E. Grinter",
          title: "Postcolonial Computing: A Lens on Design and Development",
          publicationText: "CHI 2010",
          link: "https://canvas.uw.edu/files/130302270/",
        },
        instances: [
          {
            authorText:
              "Eric Brewer, Michael Demmer, Melissa Ho, R. J. Honicky, Joyojeet Pal, Madelaine Plauche, Sonesh Surana",
            title:
              "The Challenges of Technology Research for Developing Regions",
            publicationText: "IEEE Pervasive Computing. 2006",
            link: "https://canvas.uw.edu/files/130302268/",
          },
          {
            authorText: "Dhruv Agarwal, Mor Naaman, Aditya Vashistha",
            title:
              "AI Suggestions Homogenize Writing Toward Western Styles and Diminish Cultural Nuances",
            publicationText: "To Appear, CHI 2025",
            link: "https://canvas.uw.edu/files/130302426/",
          },
        ],
      },
    },
    // Week 8
    {
      date: verifyCalendarDate("2025-02-25", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Human-Agent Interaction",
      guest: {
        name: "Gagan Bansal",
        link: "https://gagb.github.io/",
      },
      readingsStandard: {
        framing: {
          authorText: "Eric Horvitz",
          title: "Principles of Mixed-Initiative User Interfaces",
          publicationText: "CHI 1999",
          link: "https://canvas.uw.edu/files/129687500/",
        },
        instances: [
          {
            authorText:
              "Adam Fourney, Gagan Bansal, Hussein Mozannar, Cheng Tan, Eduardo Salinas, Erkang (Eric) Zhu, Friederike Niedtner, Grace Proebsting, Griffin Bassman, Jack Gerrits, Jacob Alber, Peter Chang, Ricky Loynd, Robert West, Victor Dibia, Ahmed Awadallah, Ece Kamar, Rafah Hosn, Saleema Amershi",
            title:
              "Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks",
            publicationText: "arXiv. 2024",
            link: "https://canvas.uw.edu/files/129687809/",
          },
          {
            authorText:
              "Gagan Bansal, Jennifer Wortman Vaughan, Saleema Amershi, Eric Horvitz, Adam Fourney, Hussein Mozannar, Victor Dibia, Daniel S. Weld",
            title: "Challenges in Human-Agent Communication",
            publicationText: "arXiv. 2024",
            link: "https://canvas.uw.edu/files/129687671/",
          },
        ],
      },
    },
    {
      date: verifyCalendarDate("2025-02-27", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Mental Health and Wellness",
      guest: {
        name: "Mary Czerwinski",
        link: "https://www.microsoft.com/en-us/research/people/marycz/",
      },
      readingsStandard: {
        framing: {
          authorText: "Petr Slovak, Sean A. Munson",
          title:
            "HCI Contributions in Mental Health: A Modular Framework to Guide Psychosocial Intervention Design",
          publicationText: "CHI 2024",
          link: "https://canvas.uw.edu/files/130268073/",
        },
        instances: [
          {
            authorText:
              "Jessica Schroeder, Chelsey Wilkes, Kael Rowan, Arturo Toledo, Ann Paradiso, Mary Czerwinski, Gloria Mark, Marsha M. Linehan",
            title:
              "PocketSkills: A Conversational Mobile Web App to Support Dialectical Behavioral Therapy",
            publicationText: "CHI 2018",
            link: "https://canvas.uw.edu/files/130268124/",
          },
          {
            authorText:
              "Esther Howe, Jina Suh, Mehrab Bin Morshed, Daniel McDuff, Kael Rowan, Javier Hernandez, Marah Ihab Abdin, Gonzalo Ramos, Tracy Tran, Mary Czerwinski",
            title:
              "Design of Digital Workplace Stress-Reduction Intervention Systems: Effects of Intervention Type and Timing",
            publicationText: "CHI 2022",
            link: "https://canvas.uw.edu/files/130268146/",
          },
        ],
      },
    },
    // Week 10
    {
      date: verifyCalendarDate("2025-03-11", "Tue"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Interface Toolkits",
      readingsStandard: {
        framing: {
          authorText: "Brad Myers, Scott E. Hudson, Randy Pausch",
          title: "Past, Present, and Future of User Interface Software Tools",
          publicationText: "TOCHI 2000",
          link: "https://canvas.uw.edu/files/130268362/",
        },
        instances: [
          {
            authorText:
              "Junhan Kong, Mingyuan Zhong, James Fogarty, Jacob O. Wobbrock",
            title:
              "The Ability-Based Design Mobile Toolkit (ABD-MT): Developer Support for Runtime Interface Adaptation Based on Users' Abilities",
            publicationText: "MobileHCI 2024",
            link: "https://canvas.uw.edu/files/130268429/",
          },
          {
            authorText:
              "Josh Pollock, Catherine Mei, Grace Huang, Elliot Evans, Daniel Jackson, Arvind Satyanarayan",
            title: "Bluefish: Composing Diagrams with Declarative Relations",
            publicationText: "UIST 2024",
            link: "https://canvas.uw.edu/files/130268397/",
          },
        ],
      },
    },
    {
      date: verifyCalendarDate("2025-03-13", "Thu"),
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Research Topic: Sustained HCI Research in the Wild",
      guests: [
        {
          name: "Richard Li",
          link: "https://lichard49.github.io/",
        },
        {
          name: "Esther Jang",
          link: "https://estherjang.com/",
        },
      ],
      readingsStandard: {
        framing: {
          authorText: "Philip Guo",
          title:
            "Ten Million Users and Ten Years Later: Python Tutor’s Design Guidelines for Building Scalable and Sustainable Research Software in Academia",
          publicationText: "UIST 2021",
          link: "https://canvas.uw.edu/files/130724905/",
        },
        instances: [
          {
            authorText:
              "Richard Li, Philip Vutien, Sabrina Omer, Michael Yacoub, George Ioannou, Ravi Karkar, Sean A. Munson, James Fogarty",
            title:
              "Deploying and Examining Beacon for At-Home Patient Self-Monitoring with Critical Flicker Frequency",
            publicationText: "To Appear, CHI 2025",
            link: "https://canvas.uw.edu/files/131458051/",
          },
          {
            authorText: "Esther Han Beol Jang et al",
            title: "Title Anonymized",
            publicationText: "In Preparation",
            link: "https://canvas.uw.edu/files/131458047/",
          },
        ],
      },
    },
    // Project Meetings, Week 6 and Week 9
    {
      dates: [
        verifyCalendarDate("2025-02-11", "Tue"),
        verifyCalendarDate("2025-02-13", "Thu"),
        verifyCalendarDate("2025-03-04", "Tue"),
        verifyCalendarDate("2025-03-06", "Thu"),
      ],
      timeAndLocation: TIME_AND_LOCATION_LECTURE,
      type: "lecture",
      title: "Project Milestone Meetings",
    },
*/
  ],

  officeHours: [],

  studios: [],
};
