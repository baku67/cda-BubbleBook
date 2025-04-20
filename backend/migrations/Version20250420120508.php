<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250420120508 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE dive_tag_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE dive_dive_tag (dive_id INT NOT NULL, dive_tag_id INT NOT NULL, PRIMARY KEY(dive_id, dive_tag_id))');
        $this->addSql('CREATE INDEX IDX_51F7B9032E04E766 ON dive_dive_tag (dive_id)');
        $this->addSql('CREATE INDEX IDX_51F7B90363473480 ON dive_dive_tag (dive_tag_id)');
        $this->addSql('CREATE TABLE dive_tag (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE dive_dive_tag ADD CONSTRAINT FK_51F7B9032E04E766 FOREIGN KEY (dive_id) REFERENCES dive (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dive_dive_tag ADD CONSTRAINT FK_51F7B90363473480 FOREIGN KEY (dive_tag_id) REFERENCES dive_tag (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE dive_tag_id_seq CASCADE');
        $this->addSql('ALTER TABLE dive_dive_tag DROP CONSTRAINT FK_51F7B9032E04E766');
        $this->addSql('ALTER TABLE dive_dive_tag DROP CONSTRAINT FK_51F7B90363473480');
        $this->addSql('DROP TABLE dive_dive_tag');
        $this->addSql('DROP TABLE dive_tag');
    }
}
