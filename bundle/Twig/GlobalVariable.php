<?php

declare(strict_types=1);

namespace Netgen\Bundle\ToolbarBundle\Twig;

use Ibexa\Contracts\Core\SiteAccess\ConfigResolverInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

use function array_key_exists;
use function sprintf;
use function trim;

final class GlobalVariable
{
    /**
     * @param array<string, string> $activatedBundles
     */
    public function __construct(
        private UrlGeneratorInterface $urlGenerator,
        private ConfigResolverInterface $configResolver,
        private string $ibexaAdminSiteAccessName,
        private string $legacyAdminSiteAccessName,
        private array $activatedBundles,
        private RequestStack $requestStack,
    ) {}

    public function getAdminUrlTemplate(): string
    {
        $hasLegacyAdminUI = array_key_exists('NetgenAdminUIBundle', $this->activatedBundles);

        $adminUrl = $this->urlGenerator->generate(
            'ibexa.url.alias',
            [
                'locationId' => $this->configResolver->getParameter('content.tree_root.location_id', null, 'default'),
                'siteaccess' => $hasLegacyAdminUI ? $this->legacyAdminSiteAccessName : $this->ibexaAdminSiteAccessName
            ],
            UrlGeneratorInterface::RELATIVE_PATH,
        );

        $baseUrl = $this->requestStack->getCurrentRequest()->getSchemeAndHttpHost() . $adminUrl;

        if ($hasLegacyAdminUI) {
            return sprintf('%s/%s', trim($baseUrl, '/'), 'content/view/full/{locationId}');
        }

        return sprintf('%s/%s', trim($baseUrl, '/'), 'view/content/{contentId}');
    }
}
