export interface State {
  id: number;
  name: string;
  abbreviation: string;
  shield: string;
}

export interface Municipality {
  state_id: number;
  name: string;
  id: number;
}

export interface Block {
  id: number;
  uuid: string;
  votes_obtained: string;
  valid_vote_issued: string;
  municipality: {
    id: number;
    name: string;
    shield: string;
    councils: number;
    abbreviation: string;
  };
  entity: {
    id: number;
    entitiable_type: string;
    name: string;
    acronym: string;
    logo: string;
  };
  registrations: {
    stats: {
      total: string;
      women: string;
      man: string;
      queer: string;
      compensatories: string;
    };
    list: Registration[];
  };
  assignments: {
    municipality: boolean;
    syndic: boolean;
    councils: number[];
  };
  shared_entity: {
    id: number;
    entitiable_type: string;
    name: string;
    acronym: string;
    logo: string;
  };
}

export interface Registration {
  coalition: {
    is_assigned: boolean;
    name: string;
    acronym: string;
  };
  entity: {
    name: string;
    acronym: string;
  };
  id: number;
  uuid: string;
  compensatory: {
    id: string;
    name: string;
  };
  gender: {
    id: string;
    name: string;
  };
  sex: {
    id: string;
    name: string;
  };
  postulation: {
    id: string;
    name: string;
    active: number;
  };
  position: {
    id: string;
    name: string;
  };
  migrant: {
    id: number;
    address: string;
    zip_code: string;
    country: {
      id: number;
      name: string;
      alpha3: string;
    };
  };
  block: Block;
  block_id: number;
  council_number: number;
  voter_card: {
    emission_number: string;
    section: string;
    ocr: string;
    cic: string;
  };
  curp: string;
  voter_key: string;
  occupation: string;
  residence: {
    length: {
      months: number;
      years: number;
    };
    inside_number: number;
    outside_number: number;
    postal_code: string;
    street: string;
    colony: string;
    city: string;
    municipality: string;
    state: string;
  };
  birthplace: {
    municipality: string;
    state: string;
    birth: string;
  };
  second_name: string;
  first_name: string;
  name: string;
  reelection: 'Si' | 'No';
  mote: string;
}

export interface File {
  id: number;
  url: string;
  format: string;
  registration_id: number;
  created_at: string;
  filetype: Filetype;
  name: string;
}

export interface Filetype {
  id: number;
  name: string;
  allowed_to:
    | {
        compensatory_id?: string;
        reelection?: string;
        sex?: string;
        postulation_id?: string;
        position_id?: string;
      }
    | 'all';
}

export interface Compensatory {
  id: string;
  name: string;
}

export interface User {
  id: number;
  name: string;
  entities: Entity[];
}

export interface Entity {
  id: number;
  entitiable_type: string;
  name: string;
  acronym: string;
  logo: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Genre {
  id: number;
  name: string;
}
