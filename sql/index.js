import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const db = new sqlite3.Database('estudos-sql.db', (err) => {
  if (err) {
    console.error("Erro ao abrir banco:", err.message);
    process.exit(1);
  }
});

const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error("Deu erro use: node index.js <caminho-do-arquivo.sql>");
  process.exit(1);
}

try {
  const sql = fs.readFileSync(sqlFile, 'utf-8');
  
  console.log(`--- Executando ${sqlFile} ---\n`);

  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  let index = 0;

  const runNext = () => {
    if (index >= statements.length) {
      console.log("\nExecutado com sucesso!");
      db.close();
      return;
    }

    const statement = statements[index];
    index++;

    if (statement.toUpperCase().startsWith('SELECT')) {
      db.all(statement, [], (err, rows) => {
        if (err) {
          console.error("Erro:", err.message);
          db.close();
          process.exit(1);
        }
        console.log(statement);
        console.table(rows);
        runNext();
      });
    } else {
      db.run(statement, (err) => {
        if (err) {
          console.error("Erro:", err.message);
          db.close();
          process.exit(1);
        }
        console.log("✓", statement.substring(0, 50) + (statement.length > 50 ? '...' : ''));
        runNext();
      });
    }
  };

  runNext();

} catch (err) {
  console.error("Erro ao ler arquivo:", err.message);
  db.close();
  process.exit(1);
}
