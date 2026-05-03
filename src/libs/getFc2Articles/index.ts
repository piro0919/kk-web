import data from "./data.json";

export type Fc2Article = {
  date: string;
  text: string;
  title: string;
  url: string;
};

export default function getFc2Articles(): Fc2Article[] {
  return data;
}
