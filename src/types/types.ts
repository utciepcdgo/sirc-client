export interface State {
	id: number;
	name: string;
}

export interface Municipality {
	id: number;
	name: string;
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
			compensatories: string;
		};
		list: Registration[];
	};
	assignments: {
		municipality: boolean;
		syndic: boolean;
		councils: string[];
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
		id: number;
		name: string;
	};
	gender: {
		id: number;
		name: string;
	};
	sex: {
		id: number;
		name: string;
	};
	postulation: {
		id: number;
		name: string;
		active: number;
	};
	position: {
		id: number;
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
	block: {
		id: number;
		municipality: {
			id: number;
			name: string;
			shield: string;
			abbreviation: string;
			councils: number;
		};
	};
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
		state: {
			id: number;
			name: string;
			abbreviation: string;
			shield: string;
		};
	};
	birthplace: {
		municipality: {
			id: number;
			name: string;
			state_id: string;
		};
		state: {
			id: number;
			name: string;
			abbreviation: string;
			shield: string;
		};
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
				compensatory_id?: number;
				reelection?: string;
				sex?: number;
				postulation_id?: number;
				position_id?: number;
		  }
		| 'all';
}

export interface Compensatory {
	id: number;
	name: string;
}

export interface Entity {
	id: number;
	entitiable_type: string;
	name: string;
	acronym: string;
	logo: string;
}

export interface User {
	id: number;
	name: string;
	entities: Entity[];
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface Genre {
	id: number;
	name: string;
}
