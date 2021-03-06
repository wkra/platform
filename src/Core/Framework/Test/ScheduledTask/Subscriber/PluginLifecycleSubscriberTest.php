<?php declare(strict_types=1);

namespace Shopware\Core\Framework\Test\ScheduledTask\Subscriber;

use Google\Auth\Cache\MemoryCacheItemPool;
use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\Plugin\Event\PluginPostActivateEvent;
use Shopware\Core\Framework\Plugin\Event\PluginPostDeactivateEvent;
use Shopware\Core\Framework\ScheduledTask\Registry\TaskRegistry;
use Shopware\Core\Framework\ScheduledTask\Subscriber\PluginLifecycleSubscriber;
use Symfony\Component\Messenger\Worker\StopWhenRestartSignalIsReceived;

class PluginLifecycleSubscriberTest extends TestCase
{
    public function testGetSubscribedEvents(): void
    {
        $events = PluginLifecycleSubscriber::getSubscribedEvents();

        static::assertCount(2, $events);
        static::assertArrayHasKey(PluginPostActivateEvent::class, $events);
        static::assertEquals('afterPluginStateChange', $events[PluginPostActivateEvent::class]);
        static::assertArrayHasKey(PluginPostDeactivateEvent::class, $events);
        static::assertEquals('afterPluginStateChange', $events[PluginPostDeactivateEvent::class]);
    }

    public function testRegisterScheduledTasks(): void
    {
        $taskRegistry = $this->createMock(TaskRegistry::class);
        $taskRegistry->expects(static::once())->method('registerTasks');

        $signalCachePool = new MemoryCacheItemPool();
        $subscriber = new PluginLifecycleSubscriber($taskRegistry, $signalCachePool);
        $subscriber->afterPluginStateChange();

        static::assertTrue($signalCachePool->hasItem(StopWhenRestartSignalIsReceived::RESTART_REQUESTED_TIMESTAMP_KEY));
    }
}
