<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241220183048 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE certificate_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE user_certificate_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE certificate (id INT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE user_certificate (id INT NOT NULL, user_id INT NOT NULL, certificate_id INT NOT NULL, obtained_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_888713DFA76ED395 ON user_certificate (user_id)');
        $this->addSql('CREATE INDEX IDX_888713DF99223FFD ON user_certificate (certificate_id)');
        $this->addSql('COMMENT ON COLUMN user_certificate.obtained_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE user_certificate ADD CONSTRAINT FK_888713DFA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_certificate ADD CONSTRAINT FK_888713DF99223FFD FOREIGN KEY (certificate_id) REFERENCES certificate (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE certificate_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE user_certificate_id_seq CASCADE');
        $this->addSql('ALTER TABLE user_certificate DROP CONSTRAINT FK_888713DFA76ED395');
        $this->addSql('ALTER TABLE user_certificate DROP CONSTRAINT FK_888713DF99223FFD');
        $this->addSql('DROP TABLE certificate');
        $this->addSql('DROP TABLE user_certificate');
    }
}
