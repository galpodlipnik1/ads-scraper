const setKeys = () => {
    const keys = {
        pgUser: process.env.PGUSER,
        pgHost: process.env.PGHOST,
        pgDatabase: process.env.PGDATABASE,
        pgPassword: process.env.PGPASSWORD,
        pgPort: process.env.PGPORT,
    };
    console.log(keys);
    return keys;
};
const keys = setKeys();
export default keys;
//# sourceMappingURL=keys.js.map