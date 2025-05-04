<?php

namespace Concrete\Package\HtmlBeautifier;

use Concrete\Core\Package\Package;
use Concrete\Core\Page\Page;
use Concrete\Core\User\Group\GroupRepository;
use Concrete\Core\User\User;
use Gajus\Dindent\Indenter;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\EventDispatcher\GenericEvent;

class Controller extends Package
{
    protected string $pkgHandle = 'html_beautifier';
    protected string $pkgVersion = '0.0.3';
    protected $appVersionRequired = '9.0.0';

    public function getPackageDescription(): string
    {
        return t("An HTML post-processor that cleans and structures the HTML code of your site before it's delivered to the client.");
    }

    public function getPackageName(): string
    {
        return t('HTML Beautifier');
    }

    public function on_start()
    {
        require_once('vendor/autoload.php');

        /** @var EventDispatcherInterface $eventDispatcher */
        /** @noinspection PhpUnhandledExceptionInspection */
        $eventDispatcher = $this->app->make(EventDispatcherInterface::class);

        $eventDispatcher->addListener('on_page_output', function ($event) {
            /** @var $event GenericEvent */
            $htmlCode = $event->getArgument('contents');

            $u = new User();

            /** @var GroupRepository $groupRepository */
            $groupRepository = $this->app->make(GroupRepository::class);
            $adminGroup = $groupRepository->getGroupByID(ADMIN_GROUP_ID);

            /** @var $c Page */
            $c = Page::getCurrentPage();

            if (!($u->isSuperUser() || (is_object($adminGroup) && $u->inGroup($adminGroup)) ||
                ($c instanceof Page && ($c->isEditMode())))) {

                $htmlBeautifier = new Indenter();
                $htmlCode = $htmlBeautifier->indent($htmlCode);
            }

            $event->setArgument('contents', $htmlCode);
        });
    }
}