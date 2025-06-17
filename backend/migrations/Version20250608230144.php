<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250608230144 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE dive ALTER temperature TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE dive ALTER weight TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE dive ALTER max_depth TYPE DOUBLE PRECISION');
        $this->addSql('ALTER TABLE dive ALTER oxygen_mix TYPE DOUBLE PRECISION');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE dive ALTER temperature TYPE INT');
        $this->addSql('ALTER TABLE dive ALTER weight TYPE SMALLINT');
        $this->addSql('ALTER TABLE dive ALTER max_depth TYPE SMALLINT');
        $this->addSql('ALTER TABLE dive ALTER oxygen_mix TYPE SMALLINT');
    }
}
