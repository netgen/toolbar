<?php

declare(strict_types=1);

namespace Netgen\Bundle\ToolbarBundle\DependencyInjection;

use RuntimeException;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Loader\DelegatingLoader;
use Symfony\Component\Config\Loader\LoaderResolver;
use Symfony\Component\Config\Resource\FileResource;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\GlobFileLoader;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Yaml\Yaml;

use function file_get_contents;

final class NetgenToolbarExtension extends Extension implements PrependExtensionInterface
{
    public function load(array $configs, ContainerBuilder $container): void
    {
        /** @var array<string, string> $activatedBundles */
        $activatedBundles = $container->getParameter('kernel.bundles');

        $activatedBundles['EzCoreExtraBundle'] ??
            throw new RuntimeException(
                'Netgen Toolbar Bundle requires EzCoreExtraBundle (lolautruche/ez-core-extra-bundle) to be activated to work properly.',
            );

        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        $container->setParameter('netgen_toolbar.default_admin_site_access', $config['default_admin_site_access']);
        $container->setParameter('netgen_toolbar.legacy_admin_site_access', $config['legacy_admin_site_access']);
        $container->setParameter('netgen_toolbar.admin_site_access_mapping', $config['admin_site_access_mapping']);

        $locator = new FileLocator(__DIR__ . '/../Resources/config');
        $loader = new DelegatingLoader(
            new LoaderResolver(
                [
                    new GlobFileLoader($container, $locator),
                    new YamlFileLoader($container, $locator),
                ],
            ),
        );

        $loader->load('services/**/*.yaml', 'glob');
    }

    public function prepend(ContainerBuilder $container): void
    {
        $prependConfigs = [
            'twig.yaml' => 'twig',
        ];

        foreach ($prependConfigs as $configFile => $prependConfig) {
            $configFile = __DIR__ . '/../Resources/config/' . $configFile;
            $config = Yaml::parse((string) file_get_contents($configFile));
            $container->prependExtensionConfig($prependConfig, $config);
            $container->addResource(new FileResource($configFile));
        }
    }
}
