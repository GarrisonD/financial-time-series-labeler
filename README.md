For the application to work correctly, your CSV file has to include **at least** these columns with requirements:

- `index` (number, starting at 0 and incrementing by 1)
- `timestamp` (number, UNIX timestamp)
- `open` (number)
- `high` (number)
- `low` (number)
- `close` (number)

Optionally you can add:

- `labeled` (boolean, true/false)

**ATTENTION!** Order of the columns doesn't matter but order of the rows does: rows have to be sorted ascendingly `index` column.
