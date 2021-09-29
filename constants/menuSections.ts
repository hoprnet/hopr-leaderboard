import { useRouter } from "next/router";

export const MenuSectionsDesktop = (darkMode: boolean) => {
  const router = useRouter();

  const sections = [
    {
      href: "/",
      className: `menu-item-desktop ${router.pathname == "/" ? "active" : ""}`,
      src: `/assets/icons/home${darkMode ? "_d" : ""}.svg`,
      alt: "hopr HOME",
      p: "Network",
    },
    {
      href: "/nfts",
      className: `menu-item-desktop ${
        router.pathname == "/nfts" ? "active" : ""
      }`,
      src: `/assets/icons/horp_icon.svg`,
      alt: "HOPR NFTs",
      p: "NFTs",
    },
    {
      href: "/node",
      className: `menu-item-desktop ${
        router.pathname == "/node" ? "active" : ""
      }`,
      src: `/assets/icons/magnifying.svg`,
      alt: "HOPR node",
      p: "Node(s)",
    },
    {
      href: "/help",
      className: `menu-item-desktop ${
        router.pathname == "/help" ? "active" : ""
      }`,
      src: `/assets/icons/help${darkMode ? "_d" : ""}.svg`,
      alt: "Help",
      p: "Help",
    },
  ];

  return sections;
};

export const MenuSectionsMobile = () => {
  const router = useRouter();

  const sections = [
    {
      href: "/",
      className: `${router.pathname == "/" ? "active" : ""}`,
      src: `/assets/icons/home.svg`,
      alt: "HOPR network",
      p: "Network",
    },
    {
      href: "/nfts",
      className: `${router.pathname == "/nfts" ? "active" : ""}`,
      src: `/assets/icons/horp_icon.svg`,
      alt: "HOPR NFTs",
      p: "NFTs",
    },
    {
      href: "/node",
      className: ``,
      src: `/assets/icons/magnifying.svg`,
      alt: "HOPR node",
      p: "Node",
    },
    {
      href: "/help",
      className: `${router.pathname == "/help" ? "active" : ""}`,
      src: `/assets/icons/help.svg`,
      alt: "Help",
      p: "Help",
    },
  ];

  return sections;
};

export const Networks = [
  {
    href: "https://stake.hoprnet.org",
    target: "_blank",
    src: `/assets/icons/horp_icon.svg`,
    width: "18px",
    alt: "hopr",
    p: "Stake HOPR",
  },
  {
    href: "https://twitter.com/hoprnet",
    target: "_blank",
    src: `/assets/icons/twitter.svg`,
    width: "",
    alt: "twitter",
    p: "Get updates",
  },
];
