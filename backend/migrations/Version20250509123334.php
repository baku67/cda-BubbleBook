<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250509123334 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE decompression_stop_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE decompression_stop (id INT NOT NULL, dive_id INT NOT NULL, depth SMALLINT NOT NULL, duration SMALLINT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_1488CBF82E04E766 ON decompression_stop (dive_id)');
        $this->addSql('ALTER TABLE decompression_stop ADD CONSTRAINT FK_1488CBF82E04E766 FOREIGN KEY (dive_id) REFERENCES dive (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE dive ADD max_depth SMALLINT NOT NULL');
        $this->addSql('ALTER TABLE dive ADD oxygen_mode VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE dive ADD oxygen_mix SMALLINT DEFAULT NULL');
        $this->addSql('ALTER TABLE dive ADD safety_stop BOOLEAN DEFAULT true NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE decompression_stop_id_seq CASCADE');
        $this->addSql('ALTER TABLE decompression_stop DROP CONSTRAINT FK_1488CBF82E04E766');
        $this->addSql('DROP TABLE decompression_stop');
        $this->addSql('ALTER TABLE dive DROP max_depth');
        $this->addSql('ALTER TABLE dive DROP oxygen_mode');
        $this->addSql('ALTER TABLE dive DROP oxygen_mix');
        $this->addSql('ALTER TABLE dive DROP safety_stop');
    }
}
