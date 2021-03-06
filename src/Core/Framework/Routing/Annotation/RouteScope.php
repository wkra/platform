<?php declare(strict_types=1);

namespace Shopware\Core\Framework\Routing\Annotation;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\ConfigurationAnnotation;

/**
 * @Annotation
 */
class RouteScope extends ConfigurationAnnotation
{
    /** @var array */
    private $scopes;

    public function getAliasName()
    {
        return 'routeScope';
    }

    public function allowArray()
    {
        return false;
    }

    public function getScopes(): array
    {
        return $this->scopes;
    }

    public function setScopes(array $scopes): void
    {
        $this->scopes = $scopes;
    }
}
