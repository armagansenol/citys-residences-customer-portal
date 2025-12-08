export type ResidencePlan = {
  slug: string
  block: string
  floor: string
  number: string
  image: string
  pdf: string
}

export const residencePlans: ResidencePlan[] = [
  {
    slug: "c-blok-kat-4-no-28-2-1",
    block: "C BLOK",
    floor: "Kat 4",
    number: "No 28 | 2+1",
    image: "/img/interior.jpg",
    pdf: "/pdf/plan.pdf",
  },
  {
    slug: "c-blok-kat-2-no-12-3-1",
    block: "C BLOK",
    floor: "Kat 2",
    number: "No 12 | 3+1",
    image: "/img/interior.jpg",
    pdf: "/pdf/plan.pdf",
  },
  {
    slug: "c-blok-kat-8-no-5-3-5-1",
    block: "C BLOK",
    floor: "Kat 8",
    number: "No 5 | 3.5+1",
    image: "/img/interior.jpg",
    pdf: "/pdf/plan.pdf",
  },
  {
    slug: "c-blok-kat-6-no-29-2-1",
    block: "C BLOK",
    floor: "Kat 6",
    number: "No 29 | 2+1",
    image: "/img/interior.jpg",
    pdf: "/pdf/plan.pdf",
  },
]
