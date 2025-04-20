<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250420094655 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE dive_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE divelog_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE dive (id INT NOT NULL, divelog_id INT NOT NULL, title VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, temperature INT DEFAULT NULL, visibility VARCHAR(255) DEFAULT NULL, satisfaction INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_96BB04402352FCF3 ON dive (divelog_id)');
        $this->addSql('CREATE TABLE divelog (id INT NOT NULL, owner_id INT NOT NULL, title VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, theme VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C77A4A937E3C61F9 ON divelog (owner_id)');
        $this->addSql('COMMENT ON COLUMN divelog.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE dive ADD CONSTRAINT FK_96BB04402352FCF3 FOREIGN KEY (divelog_id) REFERENCES divelog (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE divelog ADD CONSTRAINT FK_C77A4A937E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE dive_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE divelog_id_seq CASCADE');
        $this->addSql('ALTER TABLE dive DROP CONSTRAINT FK_96BB04402352FCF3');
        $this->addSql('ALTER TABLE divelog DROP CONSTRAINT FK_C77A4A937E3C61F9');
        $this->addSql('DROP TABLE dive');
        $this->addSql('DROP TABLE divelog');
    }
}
