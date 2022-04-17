import { Migration } from '@mikro-orm/migrations';

export class Migration20220410200858 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "created_at";');
    this.addSql('alter table "user" drop column "updated_at";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;');
  }

}
