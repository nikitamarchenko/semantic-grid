import * as migration_20251008_223642_dummy_1 from './20251008_223642_dummy_1';
import * as migration_20251010_202527_dashboard_item_add_height from './20251010_202527_dashboard_item_add_height';

export const migrations = [
  {
    up: migration_20251008_223642_dummy_1.up,
    down: migration_20251008_223642_dummy_1.down,
    name: '20251008_223642_dummy_1',
  },
  {
    up: migration_20251010_202527_dashboard_item_add_height.up,
    down: migration_20251010_202527_dashboard_item_add_height.down,
    name: '20251010_202527_dashboard_item_add_height'
  },
];
