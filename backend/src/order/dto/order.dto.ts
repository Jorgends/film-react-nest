export class PostOrderDTO {
  email: string;
  phone: string;
  tickets: PostOrderTicketDTO[];
}

export class PostOrderTicketDTO {
  time: string;
  day: string;
  daytime: string;
  film: string;
  session: string;
  row: number;
  seat: number;
  price: number;
}

export class NewOrderDTO {
  total: number;
  items: PostOrderTicketDTO[];
}
