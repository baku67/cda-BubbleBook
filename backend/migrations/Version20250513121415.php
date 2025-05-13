<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250513121415 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE friendship_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE friendship (id INT NOT NULL, emitter_id INT NOT NULL, recipient_id INT NOT NULL, status VARCHAR(10) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_7234A45F37BC4DC6 ON friendship (emitter_id)');
        $this->addSql('CREATE INDEX IDX_7234A45FE92F8F78 ON friendship (recipient_id)');
        $this->addSql('COMMENT ON COLUMN friendship.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE friendship ADD CONSTRAINT FK_7234A45F37BC4DC6 FOREIGN KEY (emitter_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE friendship ADD CONSTRAINT FK_7234A45FE92F8F78 FOREIGN KEY (recipient_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE friendship_id_seq CASCADE');
        $this->addSql('ALTER TABLE friendship DROP CONSTRAINT FK_7234A45F37BC4DC6');
        $this->addSql('ALTER TABLE friendship DROP CONSTRAINT FK_7234A45FE92F8F78');
        $this->addSql('DROP TABLE friendship');
    }
}
