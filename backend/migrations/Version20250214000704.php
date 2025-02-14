<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250214000704 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ADD log_books_privacy VARCHAR(255) DEFAULT \'NO_ONE\' NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD certificates_privacy VARCHAR(255) DEFAULT \'NO_ONE\' NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD gallery_privacy VARCHAR(255) DEFAULT \'NO_ONE\' NOT NULL');
        $this->addSql('ALTER TABLE "user" ALTER profil_privacy SET DEFAULT \'ALL\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP log_books_privacy');
        $this->addSql('ALTER TABLE "user" DROP certificates_privacy');
        $this->addSql('ALTER TABLE "user" DROP gallery_privacy');
        $this->addSql('ALTER TABLE "user" ALTER profil_privacy SET DEFAULT \'NO_ONE\'');
    }
}
