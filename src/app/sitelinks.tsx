import * as React from "react";

import { ok as assert } from "assert";

import { SiteLinks } from "@/data/SiteLinks";

export const SITE_LINKS = [
  SiteLinks.homeTop,
  SiteLinks.assignmentsTop,
  [
    // // Custom formatting for SiteLinks.assignmentsReadingsTop
    // {
    //   href: SiteLinks.assignmentsReadingsTop.href,
    //   anchor: (() => {
    //     assert(
    //       SiteLinks.assignmentsReadingsTop.anchor ===
    //         "Readings and Discussion Posts",
    //     );
    //
    //     return (
    //       <React.Fragment>
    //         Readings and
    //         <br />
    //         Discussion Posts
    //       </React.Fragment>
    //     );
    //   })(),
    // },
    // Custom formatting for SiteLinks.assignmentsPresentationsTop
    {
      href: SiteLinks.assignmentsPaperPresentationsTop.href,
      anchor: (() => {
        assert(
          SiteLinks.assignmentsPaperPresentationsTop.anchor ===
            "Paper Presentations",
        );

        return (
          <React.Fragment>
            Paper
            <br />
            Presentations
          </React.Fragment>
        );
      })(),
    },
    {
      href: SiteLinks.assignmentsTechnologyLabTop.href,
      anchor: (() => {
        assert(
          SiteLinks.assignmentsTechnologyLabTop.anchor === "Technology Lab",
        );

        return (
          <React.Fragment>
            Technology
            <br />
            Lab
          </React.Fragment>
        );
      })(),
    },
    SiteLinks.assignmentsProjectTop,
  ],
  SiteLinks.calendarTop,
];

export const PAGE_LINKS_PROJECT = [
  SiteLinks.assignmentsProjectTop,
  [
    // SiteLinks.assignmentsProjectProposalTop,
    // SiteLinks.assignmentsProjectMilestoneReport1Top,
    // SiteLinks.assignmentsProjectMilestoneReport2Top,
    // SiteLinks.assignmentsProjectFinalReportTop,
  ],
];
