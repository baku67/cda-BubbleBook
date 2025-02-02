<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250202122107 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ALTER is_verified SET DEFAULT false');
        $this->addSql('ALTER TABLE "user" ALTER is2fa SET DEFAULT false');
        $this->addSql('ALTER TABLE "user" ALTER account_type SET DEFAULT \'option-diver\'');
        $this->addSql('ALTER TABLE "user" ALTER avatar_url SET DEFAULT \'assets/images/default/avatars/profil-picture-default-original.webp\'');
        $this->addSql('ALTER TABLE "user" ALTER banner_url SET DEFAULT \'assets/images/default/banners/default-banner-00.webp\'');
        $this->addSql('ALTER TABLE "user" ALTER first_login_step SET DEFAULT 1');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" ALTER is_verified DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ALTER is2fa DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ALTER account_type DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ALTER avatar_url DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ALTER banner_url DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ALTER first_login_step DROP DEFAULT');
    }
}
