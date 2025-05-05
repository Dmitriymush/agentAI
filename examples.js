export const examples = [
    {
        input: 'Retrieve the key_id from the key_dictionary table where key is "totalMsgs"',
        query: "SELECT key, key_id FROM key_dictionary WHERE key = 'totalMsgs'"
    },
    {
        input: 'Retrieve data from the ts_kv table where entity_id is "3c43d1f0-0086-11ef-925e-a532ea6dfe95" key is key_id and ts is between 1713776200771 and 1713776800974',
        query: "SELECT ts, long_v, key FROM ts_kv WHERE entity_id = '3c43d1f0-0086-11ef-925e-a532ea6dfe95' AND key = 52 AND ts BETWEEN 1713776200771 AND 1713776800974"
    }
];