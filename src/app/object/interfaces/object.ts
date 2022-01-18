// To parse this data:
//
//   import { Convert, Object } from "./file";
//
//   const object = Convert.toObject(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Object {
    attributes:          Category[];
    baby_trigger_for:    null;
    category:            Category;
    cost:                number;
    effect_entries:      EffectEntry[];
    flavor_text_entries: FlavorTextEntry[];
    fling_effect:        null;
    fling_power:         null;
    game_indices:        GameIndex[];
    held_by_pokemon:     any[];
    id:                  number;
    machines:            any[];
    name:                string;
    names:               Name[];
    sprites:             Sprites;
}

export interface Category {
    name: string;
    url:  string;
}

export interface EffectEntry {
    effect:       string;
    language:     Category;
    short_effect: string;
}

export interface FlavorTextEntry {
    language:      Category;
    text:          string;
    version_group: Category;
}

export interface GameIndex {
    game_index: number;
    generation: Category;
}

export interface Name {
    language: Category;
    name:     string;
}

export interface Sprites {
    default: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toObject(json: string): Object {
        return cast(JSON.parse(json), r("Object"));
    }

    public static objectToJson(value: Object): string {
        return JSON.stringify(uncast(value, r("Object")), null, 2);
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
    "Object": o([
        { json: "attributes", js: "attributes", typ: a(r("Category")) },
        { json: "baby_trigger_for", js: "baby_trigger_for", typ: null },
        { json: "category", js: "category", typ: r("Category") },
        { json: "cost", js: "cost", typ: 0 },
        { json: "effect_entries", js: "effect_entries", typ: a(r("EffectEntry")) },
        { json: "flavor_text_entries", js: "flavor_text_entries", typ: a(r("FlavorTextEntry")) },
        { json: "fling_effect", js: "fling_effect", typ: null },
        { json: "fling_power", js: "fling_power", typ: null },
        { json: "game_indices", js: "game_indices", typ: a(r("GameIndex")) },
        { json: "held_by_pokemon", js: "held_by_pokemon", typ: a("any") },
        { json: "id", js: "id", typ: 0 },
        { json: "machines", js: "machines", typ: a("any") },
        { json: "name", js: "name", typ: "" },
        { json: "names", js: "names", typ: a(r("Name")) },
        { json: "sprites", js: "sprites", typ: r("Sprites") },
    ], false),
    "Category": o([
        { json: "name", js: "name", typ: "" },
        { json: "url", js: "url", typ: "" },
    ], false),
    "EffectEntry": o([
        { json: "effect", js: "effect", typ: "" },
        { json: "language", js: "language", typ: r("Category") },
        { json: "short_effect", js: "short_effect", typ: "" },
    ], false),
    "FlavorTextEntry": o([
        { json: "language", js: "language", typ: r("Category") },
        { json: "text", js: "text", typ: "" },
        { json: "version_group", js: "version_group", typ: r("Category") },
    ], false),
    "GameIndex": o([
        { json: "game_index", js: "game_index", typ: 0 },
        { json: "generation", js: "generation", typ: r("Category") },
    ], false),
    "Name": o([
        { json: "language", js: "language", typ: r("Category") },
        { json: "name", js: "name", typ: "" },
    ], false),
    "Sprites": o([
        { json: "default", js: "default", typ: "" },
    ], false),
};
