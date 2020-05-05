import path from 'path';
import ModuleAlias from 'module-alias';

/**
 * Register module-aliases, must be on-pair with custom-paths from
 * `tsconfig.json`.
 */
((): void => {
  const aliases = {
    '@config': path.join(__dirname, '../config'),
    '@interfaces': path.join(__dirname, '../interfaces'),
    '@server': path.join(__dirname, '../server'),
  };

  ModuleAlias.addAliases(aliases);
})();
