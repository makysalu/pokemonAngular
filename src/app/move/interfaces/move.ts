// To parse this data:
//
//   import { Convert, Move } from "./file";
//
//   const move = Convert.toMove(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Move {
    accuracy:             number;
    contest_combos:       ContestCombos;
    contest_effect:       ContestEffect;
    contest_type:         ContestType;
    damage_class:         ContestType;
    effect_chance:        null;
    effect_changes:       any[];
    effect_entries:       EffectEntry[];
    flavor_text_entries:  FlavorTextEntry[];
    generation:           ContestType;
    id:                   number;
    learned_by_pokemon:   ContestType[];
    machines:             any[];
    meta:                 Meta;
    name:                 string;
    names:                Name[];
    past_values:          any[];
    power:                number;
    pp:                   number;
    priority:             number;
    stat_changes:         any[];
    super_contest_effect: ContestEffect;
    target:               ContestType;
    type:                 ContestType;
}

export interface ContestCombos {
    normal: Normal;
    super:  Normal;
}

export interface Normal {
    use_after:  null;
    use_before: ContestType[] | null;
}

export interface ContestType {
    name: string;
    url:  string;
}

export interface ContestEffect {
    url: string;
}

export interface EffectEntry {
    effect:       string;
    language:     ContestType;
    short_effect: string;
}

export interface FlavorTextEntry {
    flavor_text:   string;
    language:      ContestType;
    version_group: ContestType;
}

export interface Meta {
    ailment:        ContestType;
    ailment_chance: number;
    category:       ContestType;
    crit_rate:      number;
    drain:          number;
    flinch_chance:  number;
    healing:        number;
    max_hits:       null;
    max_turns:      null;
    min_hits:       null;
    min_turns:      null;
    stat_chance:    number;
}

export interface Name {
    language: ContestType;
    name:     string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMove(json: string): Move {
        return cast(JSON.parse(json), r("Move"));
    }

    public static moveToJson(value: Move): string {
        return JSON.stringify(uncast(value, r("Move")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Move": o([
        { json: "accuracy", js: "accuracy", typ: 0 },
        { json: "contest_combos", js: "contest_combos", typ: r("ContestCombos") },
        { json: "contest_effect", js: "contest_effect", typ: r("ContestEffect") },
        { json: "contest_type", js: "contest_type", typ: r("ContestType") },
        { json: "damage_class", js: "damage_class", typ: r("ContestType") },
        { json: "effect_chance", js: "effect_chance", typ: null },
        { json: "effect_changes", js: "effect_changes", typ: a("any") },
        { json: "effect_entries", js: "effect_entries", typ: a(r("EffectEntry")) },
        { json: "flavor_text_entries", js: "flavor_text_entries", typ: a(r("FlavorTextEntry")) },
        { json: "generation", js: "generation", typ: r("ContestType") },
        { json: "id", js: "id", typ: 0 },
        { json: "learned_by_pokemon", js: "learned_by_pokemon", typ: a(r("ContestType")) },
        { json: "machines", js: "machines", typ: a("any") },
        { json: "meta", js: "meta", typ: r("Meta") },
        { json: "name", js: "name", typ: "" },
        { json: "names", js: "names", typ: a(r("Name")) },
        { json: "past_values", js: "past_values", typ: a("any") },
        { json: "power", js: "power", typ: 0 },
        { json: "pp", js: "pp", typ: 0 },
        { json: "priority", js: "priority", typ: 0 },
        { json: "stat_changes", js: "stat_changes", typ: a("any") },
        { json: "super_contest_effect", js: "super_contest_effect", typ: r("ContestEffect") },
        { json: "target", js: "target", typ: r("ContestType") },
        { json: "type", js: "type", typ: r("ContestType") },
    ], false),
    "ContestCombos": o([
        { json: "normal", js: "normal", typ: r("Normal") },
        { json: "super", js: "super", typ: r("Normal") },
    ], false),
    "Normal": o([
        { json: "use_after", js: "use_after", typ: null },
        { json: "use_before", js: "use_before", typ: u(a(r("ContestType")), null) },
    ], false),
    "ContestType": o([
        { json: "name", js: "name", typ: "" },
        { json: "url", js: "url", typ: "" },
    ], false),
    "ContestEffect": o([
        { json: "url", js: "url", typ: "" },
    ], false),
    "EffectEntry": o([
        { json: "effect", js: "effect", typ: "" },
        { json: "language", js: "language", typ: r("ContestType") },
        { json: "short_effect", js: "short_effect", typ: "" },
    ], false),
    "FlavorTextEntry": o([
        { json: "flavor_text", js: "flavor_text", typ: "" },
        { json: "language", js: "language", typ: r("ContestType") },
        { json: "version_group", js: "version_group", typ: r("ContestType") },
    ], false),
    "Meta": o([
        { json: "ailment", js: "ailment", typ: r("ContestType") },
        { json: "ailment_chance", js: "ailment_chance", typ: 0 },
        { json: "category", js: "category", typ: r("ContestType") },
        { json: "crit_rate", js: "crit_rate", typ: 0 },
        { json: "drain", js: "drain", typ: 0 },
        { json: "flinch_chance", js: "flinch_chance", typ: 0 },
        { json: "healing", js: "healing", typ: 0 },
        { json: "max_hits", js: "max_hits", typ: null },
        { json: "max_turns", js: "max_turns", typ: null },
        { json: "min_hits", js: "min_hits", typ: null },
        { json: "min_turns", js: "min_turns", typ: null },
        { json: "stat_chance", js: "stat_chance", typ: 0 },
    ], false),
    "Name": o([
        { json: "language", js: "language", typ: r("ContestType") },
        { json: "name", js: "name", typ: "" },
    ], false),
};
