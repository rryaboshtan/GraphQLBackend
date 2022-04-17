import { Migration } from '@mikro-orm/migrations';

export class Migration20220410201053 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "created_at" timestamptz(0) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "created_at";');
  }

}
