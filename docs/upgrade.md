# Upgrade

## Windows/Linux

1. Download and unzip poli-x.y.z.zip.
2. Stop the Poli server.
3. Backup the old poli.db. (Simply copying and saving the poli.db as a new file should work)
4. Apply the upgrade sql if needed.
```
./sqlite3 poli.db
sqlite> .read poli_upgrade_x.y.z.sql
```
5. Add the new configuration values if needed.
6. Replace the old poli-old-version.jar with the new poli-new-version.jar.
7. Start the Poli server.
