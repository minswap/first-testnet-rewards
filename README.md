1. Run this query against testnet db-sync and we get `input.csv`

```sql
SELECT T.address, COUNT(T.tx_id) AS action_count
FROM
  (
    SELECT t1.tx_id, t1.address
    FROM tx_out t1
    WHERE t1.address_has_script=false AND t1.tx_id IN (
      SELECT tx_id
      FROM tx_out
      JOIN tx ON tx_out.tx_id = tx.id
      JOIN block ON tx.block_id = block.id
      WHERE tx_out.address = 'addr_test1wp6a2j2pcvmrd23t23mjz92zjhw0hvvd67eamhp675kc2sch0tgwf' AND block.block_no <= 2888199
    ) GROUP BY t1.tx_id, t1.address
  ) T
GROUP BY T.address
ORDER BY action_count DESC;
```

2. Run `ts-node main.ts` and we get `output.csv`
